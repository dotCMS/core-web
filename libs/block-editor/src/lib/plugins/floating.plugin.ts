import { Editor, posToDOMRect, Range } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import tippy, { Instance, Props } from 'tippy.js';

export interface FloatingActionsPluginProps {
    editor: Editor;
    element: HTMLElement;
    tippyOptions?: Partial<Props>;
    on: {
        command: (props: { rect: DOMRect, range: Range, editor: Editor }) => void;
        keydown: (view: EditorView, event: KeyboardEvent) => void;
    }

}

export type FloatingActionsViewProps = FloatingActionsPluginProps & {
    view: EditorView;
};

export const FLOATING_ACTIONS_MENU_KEYBOARD = 'menuFloating';

export class FloatingActionsView {
    public editor: Editor;

    public element: HTMLElement;

    public view: EditorView;


    public tippy!: Instance;

    public command: (props: { rect: DOMRect, range: Range, editor: Editor }) => void;

    constructor({ editor, element, view, tippyOptions, on: { command } }: FloatingActionsViewProps) {
        this.editor = editor;
        this.element = element;
        this.view = view;
        this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true });
        this.createTooltip(tippyOptions);
        this.element.style.visibility = 'visible';
        this.command = command;
    }

    mousedownHandler = (e: MouseEvent) => {
        // This preventDefault avoid losing focus in the editor on click
        e.preventDefault();

        const { from, to } = this.editor.state.selection;
        const rect = posToDOMRect(this.view, from, to);
        this.command({ rect, range: { from, to }, editor: this.editor });


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
                const { open } = this.getState(view.state);

                if (open) {
                    options.on.keydown(view, event);
                }
                return open
            },
        }
    });
};
