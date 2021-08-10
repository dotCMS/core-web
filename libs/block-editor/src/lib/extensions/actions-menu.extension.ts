import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';

import { Editor, Extension, Range } from '@tiptap/core';
import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

import tippy, { GetReferenceClientRect } from 'tippy.js';

import { FloatingActionsPlugin, FLOATING_ACTIONS_MENU_KEYBOARD } from '../plugins/floating.plugin';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { EditorView } from 'prosemirror-view';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        actionsMenu: {
            /**
             * Add Heading
             */
            addHeading: (attr: any) => ReturnType;
            addContentletBlock: (attr: any) => ReturnType;
        };
    }
}

export type FloatingMenuOptions = Omit<FloatingMenuPluginProps, 'editor' | 'element'> & {
    element: HTMLElement | null;
    suggestion: Omit<SuggestionOptions, 'editor'>;
};

function getMenuComponent(injector: Injector, resolver: ComponentFactoryResolver) {
    const factory = resolver.resolveComponentFactory(SuggestionsComponent);
    const component = factory.create(injector);
    component.changeDetectorRef.detectChanges();
    return component;
}

function getTippyInstance({
    element,
    content,
    rect,
    onHide
}: {
    element: Element;
    content: Element;
    rect: GetReferenceClientRect;
    onHide?: () => void
}) {
    return tippy(element, {
        appendTo: document.body,
        content: content,
        placement: 'auto-start',
        getReferenceClientRect: rect,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        onHide
    });
}

function execCommand({
    editor,
    range,
    props
}: {
    editor: Editor;
    range: Range;
    props: { type: { name: string; level?: number }; payload: unknown };
}) {
    const whatToDo = {
        dotContent: () => {
            editor.chain().addContentletBlock({ range, payload: props.payload }).run();
        },
        heading: () => {
            editor.chain().addHeading({ range, type: props.type }).run();
        },
        listOrdered: () => {
            editor.chain().deleteRange(range).toggleOrderedList().focus().run()
        },
        listUnordered: () => {
            editor.chain().deleteRange(range).toggleBulletList().focus().run()
        }
    }

    whatToDo[props.type.name]();
}

export const ActionsMenu = (injector: Injector, resolver: ComponentFactoryResolver) => {
    return Extension.create<FloatingMenuOptions>({
        name: 'actionsMenu',

        defaultOptions: {
            element: null,
            suggestion: {
                char: '/c',
                allowSpaces: true,
                startOfLine: true,
                command: execCommand,
                allow: ({ editor, range }: SuggestionProps) => {
                    // needs to check if we need this allow at all.
                    return true;
                },
                items: (param) => {
                    console.log({ param });
                    return [];
                },
                render: () => {
                    let myTippy;
                    let component: ComponentRef<SuggestionsComponent>;

                    return {
                        onStart: (props: SuggestionProps) => {
                            console.log('onStart')

                            component = getMenuComponent(injector, resolver);
                            component.instance.command = props.command;
                            component.instance.setFirstItemActive();

                            myTippy = getTippyInstance({
                                element: props.editor.view.dom,
                                content: component.location.nativeElement,
                                rect: props.clientRect
                            });
                        },
                        onExit: () => {
                            myTippy.destroy();
                        },
                        onKeyDown({ event, view }) {
                            console.log('suggestions keydown', { event });
                            const key = (event as KeyboardEvent).key;

                            if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
                                component.instance.onKeyDown(event);
                                return true;
                            }

                            return false;
                        },
                    };
                }
            }
        },

        addCommands() {
            return {
                addHeading: ({ range, type }) => ({ chain }) => {
                    return chain()
                        .focus()
                        .deleteRange(range)
                        .toggleHeading({ level: type.level })
                        .focus()
                        .run();
                },
                addContentletBlock: ({ range, payload }) => ({ chain }) => {
                    return chain()
                        .deleteRange(range)
                        .command((data) => {
                            const node = data.editor.schema.nodes.dotContent.create({
                                data: payload
                            });
                            data.tr.replaceSelectionWith(node);
                            return true;
                        })
                        .focus()
                        .run();
                }
            };
        },

        addProseMirrorPlugins() {
            const factoryButton = resolver.resolveComponentFactory(ActionButtonComponent);
            const button = factoryButton.create(injector);

            let myTippy;

            let component: ComponentRef<SuggestionsComponent>;

            return [
                FloatingActionsPlugin({
                    editor: this.editor,
                    element: button.location.nativeElement,
                    on: {
                        command: ({
                            range,
                            rect,
                            editor
                        }: {
                            rect: DOMRect;
                            range: Range;
                            editor: Editor;
                        }) => {
                            component = getMenuComponent(injector, resolver);

                            component.instance.command = ({ type, payload }) => {
                                execCommand({
                                    editor,
                                    range,
                                    props: {
                                        type,
                                        payload
                                    }
                                });
                                myTippy.destroy();
                            };

                            component.instance.setFirstItemActive();

                            myTippy = getTippyInstance({
                                element: this.editor.view.dom,
                                content: component.location.nativeElement,
                                rect: () => rect,
                                onHide: () => {
                                    const transaction = editor.state.tr.setMeta(FLOATING_ACTIONS_MENU_KEYBOARD, {
                                        open: false,
                                    })
                                    editor.view.dispatch(transaction)
                                }
                            });
                        },
                        keydown: ((view: EditorView, event: KeyboardEvent) => {
                            const key = (event as KeyboardEvent).key;

                            if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
                                component.instance.onKeyDown(event);
                            }

                            if (key === 'Escape') {
                                myTippy.hide();
                            }
                        })
                    }

                }),
                Suggestion({
                    editor: this.editor,
                    ...this.options.suggestion
                })
            ];
        }
    });
};
