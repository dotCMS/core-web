import { ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
import { Editor, posToDOMRect, Extension } from '@tiptap/core';

// ProseMirror
import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// Tippy
import tippy, { Instance } from 'tippy.js';

// BubbleMenu
import { BubbleMenuComponent } from './components/bubble-menu/bubble-menu.component';

const pluginKey = new PluginKey('bubbleMenu');

export class BubbleMenuView {
    editor: Editor;
    element: HTMLElement;
    view: EditorView;
    tippy!:  Instance;
    key: PluginKey;
    onStart: any;

    constructor({
        editor,
        element,
        view,
        key,
        onStart
    }: any) {
        this.editor = editor;
        this.element = element;
        this.view = view;
        this.key = key;
        this.onStart = onStart;
        this.createTooltip();
        this.addEventListeners();
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

    update(view: EditorView, prevState: EditorState) {
        this.view = view;
        const { selection } = view.state;
        const { empty, from, to } = selection;
        const state = this.key.getState(view.state);
        if(state.open) {
            return;
        }

        if (empty) {
            this.tippy.hide();
            return;
        }
        // TODO: SET MARK TYPES ACTIVE ON TE MENU
        // console.log(selection.$head.parent);
        this.tippy.setProps({
            getReferenceClientRect: () => posToDOMRect(view, from, to)
        });
        this.onStart(view);
        this.tippy.show();
    }

    destroy() {
        this.removeEvents();
    }

    addEventListeners() {
        this.view.dom.addEventListener('click', this.onClickDocument.bind(this))
        this.element.addEventListener('click', this.onClickMenu)
    }

    removeEvents() {
        this.view.dom.removeEventListener('click', this.onClickDocument, false);
        this.element.removeEventListener('click', this.onClickMenu, false);
    }

    onClickDocument(): void {
        const state = this.key.getState(this.view.state);
        if( state ){
            const transaction = this.view.state.tr.setMeta(pluginKey, {
                open: false
            });
            this.view.dispatch(transaction);
        }
    }

    onClickMenu(event: MouseEvent): void {
        event.stopPropagation();
    }

}

export const BubbleMenu = (injector: Injector, resolver: ComponentFactoryResolver) => {

    const factoryMenu = resolver.resolveComponentFactory(BubbleMenuComponent);
    const bubbleMenu: ComponentRef<BubbleMenuComponent> = factoryMenu.create(injector);

    function onStart(view: EditorView): void {
        bubbleMenu.changeDetectorRef.detectChanges();
        bubbleMenu.instance.execMark = (item: any) => menuActions(this.editor, item);
        const transaction = view.state.tr.setMeta(pluginKey, {
            open: true
        });
        view.dispatch(transaction);
    }

    function menuActions(editor, item: any) {
        const marks = {
            bold: () => {
                editor.commands.toggleBold();
            },
            italic: () => {
                editor.commands.toggleItalic();
            },
            strike: () => {
                editor.commands.toggleStrike();
            },
            clearAll: () => {
                editor.commands.unsetAllMarks();
            }
        };
        marks[item.mark] ? marks[item.mark]() : null;
    }

    return Extension.create<any>({
        name: 'bubbleMenu',
        defaultOptions: {
            element: null
        },

        addProseMirrorPlugins() {

            return [
                new Plugin({
                    key: pluginKey,
                    view: (view: EditorView) =>
                        new BubbleMenuView({
                            key: pluginKey,
                            view,
                            editor: this.editor,
                            element: bubbleMenu.location.nativeElement,
                            onStart
                        }),
                    state: {
                        init(): { open: boolean } {
                            return {
                                open: false
                            };
                        },

                        apply(transaction: Transaction, prevState:any): { open: boolean } {
                            const transactionMeta = transaction.getMeta(pluginKey);
                            const open =
                                typeof transactionMeta?.open === 'boolean'
                                    ? transactionMeta?.open
                                    : prevState.open;
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
                })
            ];
        }
    });
};


