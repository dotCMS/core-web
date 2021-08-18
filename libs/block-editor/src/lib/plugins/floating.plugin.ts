import { Editor, posToDOMRect, Range } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import tippy, { Instance, Props } from 'tippy.js';

export interface FloatingActionsPluginProps {
    editor: Editor;
    element: HTMLElement;
    tippyOptions?: Partial<Props>;
    render?: () => FloatingRenderActions;
}

export type FloatingActionsViewProps = FloatingActionsPluginProps & {
    view: EditorView;
};

export interface FloatingActionsProps {
    range: Range;
    editor: Editor;
    command: (props: any) => void;
    clientRect: (() => DOMRect) | null;
}

export interface FloatingActionsKeydownProps {
    view: EditorView,
    event: KeyboardEvent,
    range: Range,
}

export interface FloatingRenderActions {
    onStart?: (props: FloatingActionsProps) => void;
    onExit?: (props: FloatingActionsProps) => void;
    onKeyDown?: (props: FloatingActionsKeydownProps) => boolean;
}

export const FLOATING_ACTIONS_MENU_KEYBOARD = 'menuFloating';

export class FloatingActionsView {
    editor: Editor;
    element: HTMLElement;
    view: EditorView;
    tippy!: Instance;
    render: () => FloatingRenderActions;
    command: (props: FloatingActionsProps) => void;

    constructor({ editor, element, view, tippyOptions, render }: FloatingActionsViewProps) {
        this.editor = editor;
        this.element = element;
        this.view = view;
        this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true });
        this.element.style.visibility = 'visible';
        this.render = render;

        this.createTooltip(tippyOptions);
    }

    mousedownHandler = (e: MouseEvent) => {
        // This preventDefault avoid losing focus in the editor on click
        e.preventDefault();

        const { from, to } = this.editor.state.selection;
        const rect = posToDOMRect(this.view, from, to);
        this.render().onStart({
            clientRect: () => rect,
            range: { from, to },
            editor: this.editor,
            command: this.command
        });


        const transaction = this.editor.state.tr.setMeta(FLOATING_ACTIONS_MENU_KEYBOARD, {
            open: true,
        })
        this.editor.view.dispatch(transaction)
    };

    createTooltip(options: Partial<Props> = {}) {
        this.tippy = tippy(this.view.dom, {
            duration: 0,
            getReferenceClientRect: null,
            content: this.element,
            interactive: true,
            trigger: 'manual',
            placement: 'left',
            hideOnClick: 'toggle',
            ...options
        });
    }

    update(view: EditorView) {
        const { selection } = view.state;
        const { $anchor, empty, from, to } = selection;

        const isRootDepth = $anchor.depth === 1;
        const isNodeEmpty =
            !selection.$anchor.parent.isLeaf && !selection.$anchor.parent.textContent;
        const isActive = isRootDepth && isNodeEmpty;

        if (!empty || !isActive) {
            this.hide();

            return;
        }

        this.tippy.setProps({
            getReferenceClientRect: () => posToDOMRect(view, from, to)
        });

        this.show();
    }

    show() {
        this.tippy.show();
    }

    hide() {
        this.tippy.hide();
    }

    destroy() {
        this.tippy.destroy();
        this.element.removeEventListener('mousedown', this.mousedownHandler);
    }
}

export const FloatingActionsPluginKey = new PluginKey(FLOATING_ACTIONS_MENU_KEYBOARD);

export const FloatingActionsPlugin = (options: FloatingActionsPluginProps) => {
    return new Plugin({
        key: FloatingActionsPluginKey,
        view: (view) => new FloatingActionsView({ view, ...options }),
        state: {
            init() {
                return {
                    open: false
                }
            },
            apply(transaction, prev: EditorState, newState: EditorState) {
                const meta = transaction.getMeta(FLOATING_ACTIONS_MENU_KEYBOARD);
                const state = this.getState(newState);
                const open = meta ? meta.open : state.open;

                return {
                    ...prev,
                    open: open
                };
            }
        },
        props: {
            handleKeyDown(view: EditorView, event: KeyboardEvent) {
                const { open, range } = this.getState(view.state);

                if (!open) {
                    return false
                }
                return options.render().onKeyDown({ event, range, view })
            },
        }
    });
};
