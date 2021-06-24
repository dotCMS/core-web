import { ComponentFactoryResolver, Injector } from '@angular/core';

import { Editor, Extension, Range } from '@tiptap/core';
import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

import tippy from 'tippy.js';

import { FloatingActionsPlugin } from '../plugins/floating.plugin';
import { SuggestionsComponent } from '../suggestions/suggestions.component';
import { ActionButtonComponent } from './action-button/action-button.component';

export type FloatingMenuOptions = Omit<FloatingMenuPluginProps, 'editor' | 'element'> & {
    element: HTMLElement | null;
    suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const ActionsMenu = (injector: Injector, resolver: ComponentFactoryResolver) => {
    return Extension.create<FloatingMenuOptions>({
        name: 'actionsMenu',

        defaultOptions: {
            element: null,
            suggestion: {
                char: '/c',
                allowSpaces: true,
                startOfLine: true,
                command: ({
                    editor,
                    range,
                    props
                }: {
                    editor: Editor;
                    range: Range;
                    props: { type: string; payload: unknown };
                }) => {
                    if (props.type === 'dotContent') {
                        editor
                            .chain()
                            .deleteRange(range)
                            .command((data) => {
                                const node = data.editor.schema.nodes.dotContent.create({
                                    data: props.payload
                                });
                                data.tr.replaceSelectionWith(node);
                                return true;
                            })
                            .focus()
                            .run();
                    } else {
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 1 })
                            .focus()
                            .run();
                    }
                },
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

                    return {
                        onStart: (props: SuggestionProps) => {
                            const factory = resolver.resolveComponentFactory(SuggestionsComponent);
                            const component = factory.create(injector);
                            component.instance.command = props.command;
                            component.changeDetectorRef.detectChanges();

                            myTippy = tippy(props.editor.view.dom, {
                                appendTo: document.body,
                                content: component.location.nativeElement,
                                placement: 'auto-start',
                                getReferenceClientRect: props.clientRect,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual'
                            });
                        },
                        onExit: () => {
                            myTippy.destroy();
                        }
                    };
                }
            }
        },

        addProseMirrorPlugins() {
            const factoryButton = resolver.resolveComponentFactory(ActionButtonComponent);
            const button = factoryButton.create(injector);

            let myTippy;

            return [
                FloatingActionsPlugin({
                    editor: this.editor,
                    element: button.location.nativeElement,
                    onAction: (rect: DOMRect, range: Range) => {
                        const factorySuggestions = resolver.resolveComponentFactory(
                            SuggestionsComponent
                        );
                        const suggestions = factorySuggestions.create(injector);

                        suggestions.instance.command = (item) => {
                            this.editor
                                .chain()
                                .focus()
                                .insertContentAt(range, {
                                    type: 'dotContent',
                                    attrs: {
                                        data: item
                                    }
                                })
                                .run();
                            myTippy.destroy();
                        };
                        suggestions.changeDetectorRef.detectChanges();

                        myTippy = tippy(this.editor.view.dom, {
                            appendTo: document.body,
                            content: suggestions.location.nativeElement,
                            placement: 'auto-start',
                            getReferenceClientRect: () => rect,
                            showOnCreate: true,
                            interactive: true,
                            trigger: 'manual'
                        });
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
