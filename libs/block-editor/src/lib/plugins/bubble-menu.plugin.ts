import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { Editor, posToDOMRect } from '@tiptap/core';

import { Instance } from 'tippy.js';
import tippy from 'tippy.js';

const BUBBLE_MENU_KEY = new PluginKey('bubbleMenu');

interface BubbleMenuState {
    open: boolean;
}

interface BubbleMenuPluginPorps {
    editor: Editor;
    element: HTMLElement;
    onOpen: (view:EditorView, key: PluginKey) => void;
    changeState: (view:EditorView, key: PluginKey, open:boolean) => void;
}

interface BubbleMenuViewProps extends BubbleMenuPluginPorps {
    key: PluginKey;
    view:EditorView;
}

export class BubbleMenuView {

    editor: Editor;
    element: HTMLElement;
    view: EditorView;
    tippy:  Instance;
    key: PluginKey;

    onOpen: (view:EditorView, key: PluginKey) => void;
    changeState: (view:EditorView, Key: PluginKey, open:boolean) => void;

    constructor({
        editor,
        element,
        view,
        key,
        onOpen,
        changeState
    }: BubbleMenuViewProps) {
        this.editor = editor;
        this.element = element;
        this.view = view;
        this.key = key;
        this.onOpen = onOpen;
        this.changeState = changeState;
        this.createTooltip();
        this.addEventListeners();
    }

    update(view: EditorView) {
        const { selection } = view.state;
        const { empty, from, to } = selection;
        const state = this.key.getState(view.state);

        this.tippy.setProps({
            getReferenceClientRect: () => posToDOMRect(view, from, to)
        });

        
        if(empty || from === to) {
            this.tippy.hide();
            return;
        }
        
        if (state.open) {
            return;
        }

        // For some reason, it's no empty
        // console.log('After empty', empty, from, to);
        // TODO: SET MARK TYPES ACTIVE ON TE MENU
        // console.log(selection.$head.parent);

        if( !state.open ) {
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
            hideOnClick: false
        });
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
        if( state.open ){
            this.changeState(this.view, this.key, false);
        }
    }

    onClickMenu(event: MouseEvent): void {
        event.stopPropagation();
    }
}

export const BubbleMenuPlugin = (options: BubbleMenuPluginPorps) => {
    return new Plugin({
        key: BUBBLE_MENU_KEY,
        view: (view) =>
            new BubbleMenuView({view, key: BUBBLE_MENU_KEY, ...options}),
            state: {
                init(): BubbleMenuState {
                    return {
                        open: false
                    };
                },
                apply(transaction: Transaction, oldState:any): BubbleMenuState {
                    const transactionMeta = transaction.getMeta(BUBBLE_MENU_KEY);
                    // TODO: Better way to manage state
                    const open =
                        typeof transactionMeta?.open === 'boolean'
                            ? transactionMeta?.open
                            : oldState.open;
                    if (open) {
                        return {
                            open: open,
                        };
                    }
                    return {
                        open: false
                    };
                }
            }
    });
};
