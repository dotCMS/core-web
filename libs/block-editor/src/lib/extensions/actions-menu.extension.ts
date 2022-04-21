import { ComponentRef, ViewContainerRef } from '@angular/core';

import { Editor, Extension, Range } from '@tiptap/core';
import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

import tippy, { GetReferenceClientRect } from 'tippy.js';

import {
    FloatingActionsKeydownProps,
    FloatingActionsPlugin,
    FloatingActionsProps,
    FLOATING_ACTIONS_MENU_KEYBOARD
} from '../plugins/floating.plugin';
import {
    SuggestionsCommandProps,
    SuggestionsComponent
} from './components/suggestions/suggestions.component';
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

function getSuggestionComponent(viewContainerRef: ViewContainerRef) {
    const component = viewContainerRef.createComponent(SuggestionsComponent);
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
    onHide?: () => void;
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
    props: SuggestionsCommandProps;
}) {
    const whatToDo = {
        dotContent: () => {
            editor.chain().addContentletBlock({ range, payload: props.payload }).run();
        },
        heading: () => {
            editor.chain().addHeading({ range, type: props.type }).run();
        },
        orderedList: () => {
            editor.chain().deleteRange(range).toggleOrderedList().focus().run();
        },
        bulletList: () => {
            editor.chain().deleteRange(range).toggleBulletList().focus().run();
        },
        blockquote: () => {
            editor.chain().deleteRange(range).setBlockquote().focus().run();
        },
        codeBlock: () => {
            editor.chain().deleteRange(range).setCodeBlock().focus().run();
        },
        horizontalLine: () => {
            editor.chain().deleteRange(range).setHorizontalRule().focus().run();
        }
    };

    whatToDo[props.type.name]
        ? whatToDo[props.type.name]()
        : editor.chain().setTextSelection(range).focus().run();
}

export const ActionsMenu = (viewContainerRef: ViewContainerRef) => {
    let myTippy;
    let suggestionsComponent: ComponentRef<SuggestionsComponent>;

    /**
     * Get's called on button click or suggestion char
     *
     * @param {(SuggestionProps | FloatingActionsProps)} { editor, range, clientRect }
     */
    function onStart({ editor, range, clientRect }: SuggestionProps | FloatingActionsProps): void {
        suggestionsComponent = getSuggestionComponent(viewContainerRef);
        suggestionsComponent.instance.onSelection = (item) => {
            // @ts-expect-error: As this point suggestion$ will be valid in the state.
            range.to = range.to + editor.view.state.suggestion$.query.length;
            execCommand({ editor: editor, range: range, props: item });
        };

        myTippy = getTippyInstance({
            element: editor.view.dom,
            content: suggestionsComponent.location.nativeElement,
            rect: clientRect,
            onHide: () => {
                const transaction = editor.state.tr.setMeta(FLOATING_ACTIONS_MENU_KEYBOARD, {
                    open: false
                });
                editor.view.dispatch(transaction);
            }
        });
    }

    /**
     * Handle the keyboard events when the suggestion are opened
     *
     * @param {FloatingActionsKeydownProps} { event }
     * @return {*}  {boolean}
     */
    function onKeyDown({ event }: FloatingActionsKeydownProps): boolean {
        const { key } = event;

        if (key === 'Escape') {
            myTippy.hide();
            return true;
        }

        if (key === 'Enter') {
            suggestionsComponent.instance.execCommand();
            return true;
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            suggestionsComponent.instance.updateSelection(event);
            return true;
        }
        return false;
    }

    function onExit() {
        myTippy?.destroy();
        suggestionsComponent.destroy();
    }

    return Extension.create<FloatingMenuOptions>({
        name: 'actionsMenu',
        defaultOptions: {
            pluginKey: 'actionsMenu',
            element: null,
            suggestion: {
                char: '/',
                allowSpaces: true,
                startOfLine: true,
                render: () => {
                    return {
                        onStart,
                        onKeyDown,
                        onExit
                    };
                },
                items: ({ query }) => {
                    if (suggestionsComponent) {
                        suggestionsComponent.instance.filterItems(query);
                    }
                    // suggestions plugin need to return something,
                    // but we are using the angular suggestionsComponent
                    return [];
                }
            }
        },

        addCommands() {
            return {
                addHeading:
                    ({ range, type }) =>
                    (editor) => {
                        return editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: type.level })
                            .focus()
                            .run();
                    },
                addContentletBlock:
                    ({ range, payload }) =>
                    ({ chain }) => {
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
            const button = viewContainerRef.createComponent(ActionButtonComponent);

            return [
                FloatingActionsPlugin({
                    command: execCommand,
                    editor: this.editor,
                    element: button.location.nativeElement,
                    render: () => {
                        return {
                            onStart,
                            onKeyDown,
                            onExit
                        };
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
