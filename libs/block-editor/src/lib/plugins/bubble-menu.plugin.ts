import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';

import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core';

import { Instance } from 'tippy.js';
import tippy from 'tippy.js';

const BUBBLE_MENU_KEY = new PluginKey('bubbleMenu');

interface BubbleMenuState {
    open: boolean;
}

interface BubbleMenuPluginProps {
    editor: Editor;
    element: HTMLElement;
    onOpen: (view:EditorView, key: PluginKey) => void;
    updateActiveMarks: ( marks: string[] ) => void;
    changeState: (view:EditorView, key: PluginKey, open:boolean) => void;
}

interface BubbleMenuViewProps extends BubbleMenuPluginProps {
    key: PluginKey;
    view:EditorView;
}

export class BubbleMenuView {
    editor: Editor;
    element: HTMLElement;
    view: EditorView;
    tippy: Instance;
    key: PluginKey;
    enabledMarks: string[] = [];
    textAlings: string[] = ['left', 'center', 'right'];

    onOpen: (view: EditorView, key: PluginKey) => void;
    updateActiveMarks: (marks: string[]) => void;
    changeState: (view: EditorView, Key: PluginKey, open: boolean) => void;

    constructor({
        editor,
        element,
        view,
        key,
        onOpen,
        updateActiveMarks,
        changeState
    }: BubbleMenuViewProps) {
        this.editor = editor;
        this.element = element;
        this.view = view;
        this.key = key;
        this.onOpen = onOpen;
        this.updateActiveMarks = updateActiveMarks;
        this.enabledMarks = this.getEnabledMarks();
        this.changeState = changeState;
        this.createTooltip();
        this.addEventListeners();
    }

    update(view: EditorView, oldState: EditorState) {
        const { state, composing } = view;
        const { doc, selection } = state;
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

        const { empty, from, to } = selection;
        const pluginState = this.key.getState(view.state);

        this.setTippyPosition(view);

        if (composing || isSame) {
            return;
        }

        if (empty || from === to) {
            this.tippy.hide();
            return;
        }

        if (pluginState.open) {
            return;
        }

        this.updateActiveMarks(this.getActiveMarks());

        if (!pluginState.open) {
            this.onOpen(view, this.key);
            this.tippy.show();
        }
    }

    destroy() {
        this.removeEvents();
    }

    createTooltip(): void {
        this.tippy = tippy(this.view.dom, {
            appendTo: document.body,
            duration: 0,
            getReferenceClientRect: null,
            content: this.element,
            interactive: true,
            placement: 'bottom-start',
            trigger: 'manual',
            hideOnClick: false,
            maxWidth: 'none'
        });
    }

    setTippyPosition(view: EditorView) {
        const { state } = view;
        const selection = state.selection;
        const { from, to } = selection;

        this.tippy.setProps({
            getReferenceClientRect: () => {
                if (isNodeSelection(selection)) {
                    const node = view.nodeDOM(from) as HTMLElement;

                    if (node) {
                        return node.getBoundingClientRect();
                    }
                }

                return posToDOMRect(view, from, to);
            }
        });
    }

    getEnabledMarks() {
        return [...Object.keys(this.editor.schema.marks), ...Object.keys(this.editor.schema.nodes)];
    }

    getActiveMarks(): string[] {
        return [
            ...this.enabledMarks.filter((mark) => this.editor.isActive(mark)),
            ...this.textAlings.filter((alignment) => this.editor.isActive({ textAlign: alignment }))
        ];
    }

    addEventListeners() {
        this.view.dom.addEventListener('click', this.onClickDocument.bind(this));
        this.element.addEventListener('click', this.onClickMenu);
    }

    removeEvents() {
        this.view.dom.removeEventListener('click', this.onClickDocument, false);
        this.element.removeEventListener('click', this.onClickMenu, false);
    }

    onClickDocument(): void {
        const state = this.key.getState(this.view.state);
        if (state.open) {
            this.changeState(this.view, this.key, false);
        }
    }

    onClickMenu(event: MouseEvent): void {
        event.stopPropagation();
    }
}

export const BubbleMenuPlugin = (options: BubbleMenuPluginProps) => {
    return new Plugin({
        key: BUBBLE_MENU_KEY,
        view: (view) => new BubbleMenuView({ view, key: BUBBLE_MENU_KEY, ...options }),
        state: {
            init(): BubbleMenuState {
                return {
                    open: false
                };
            },
            apply(transaction: Transaction): BubbleMenuState {
                const transactionMeta = transaction.getMeta(BUBBLE_MENU_KEY);
                // TODO: Better way to manage state
                const open = transactionMeta?.open;
                if (open) {
                    return {
                        open: open
                    };
                }
                return {
                    open: false
                };
            }
        }
    });
};
