import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';

import { Editor, Extension, Range } from '@tiptap/core';
import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

import tippy, { GetReferenceClientRect } from 'tippy.js';

import { FloatingActionsPlugin, FloatingActionsProps, FLOATING_ACTIONS_MENU_KEYBOARD } from '../plugins/floating.plugin';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';

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

function getSuggestionComponent(injector: Injector, resolver: ComponentFactoryResolver) {
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
        offset: [30, 0],
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
    let myTippy;
    let menu: ComponentRef<SuggestionsComponent>;

    function onStart(props: SuggestionProps | FloatingActionsProps) {
        menu = getSuggestionComponent(injector, resolver);
        menu.instance.command = props.command;
        menu.instance.setFirstItemActive();

        myTippy = getTippyInstance({
            element: props.editor.view.dom,
            content: menu.location.nativeElement,
            rect: props.clientRect,
            onHide: () => {
                const transaction = props.editor.state.tr.setMeta(FLOATING_ACTIONS_MENU_KEYBOARD, {
                    open: false,
                })
                props.editor.view.dispatch(transaction)
            }
        });
    }

    function onKeyDown({ event }) {
        const { key } = event;

        if (key === 'Escape') {
            myTippy.hide();
            return true;
        }

        if (key === 'Enter') {
            menu.instance.execCommand();
            return true;
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            menu.instance.updateSelection(event);
            return true;
        }

        return false;
    }


    return Extension.create<FloatingMenuOptions>({
        name: 'actionsMenu',
        defaultOptions: {
            element: null,
            suggestion: {
                char: '/c',
                allowSpaces: true,
                startOfLine: true,
                command: execCommand,
                render: () => {
                    return {
                        onStart,
                        onKeyDown,
                        onExit: () => {
                            myTippy.destroy();
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

            return [
                FloatingActionsPlugin({
                    editor: this.editor,
                    element: button.location.nativeElement,
                    render: () => {
                        return {
                            onStart,
                            onKeyDown
                        }
                    },
                }),
                Suggestion({
                    editor: this.editor,
                    ...this.options.suggestion
                })
            ];
        }
    });
};
