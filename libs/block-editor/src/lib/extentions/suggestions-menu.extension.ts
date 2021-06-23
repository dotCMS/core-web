import { ComponentFactoryResolver, Injector } from '@angular/core';

import { Editor, Extension, Range } from '@tiptap/core';
import { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

import tippy from 'tippy.js';

import { SuggestionsComponent } from '../suggestions/suggestions.component';

export type SuggestionsMenuOptions = Omit<FloatingMenuPluginProps, 'editor' | 'element'> & {
    suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const SuggestionsMenu = (injector: Injector, resolver: ComponentFactoryResolver) => {
    return Extension.create<SuggestionsMenuOptions>({
        name: 'suggestionMenu',

        defaultOptions: {
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
            return [
                Suggestion({
                    editor: this.editor,
                    ...this.options.suggestion
                })
            ];
        }
    });
};
