import { ComponentFactoryResolver, Injector } from '@angular/core';
import { Node, mergeAttributes, Editor, Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { AngularNodeViewRenderer } from '../NodeViewRenderer';
import { SuggestionsComponent } from '../suggestions/suggestions.component';
import { ContentletBlockComponent } from './contentlet-block/contentlet-block.component';
import tippy from 'tippy.js';


export const ContentletBlockExtension = (
    injector: Injector,
    resolver: ComponentFactoryResolver
): Node<any> => {
    console.log('ContentletBlockExtension');

    return Node.create({
        name: 'dotContent',
        defaultOptions: {
            HTMLAttributes: {},
            value: '',
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
                    props: unknown;
                }) => {
                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, {
                            type: 'dotContent',
                            attrs: {
                                data: props
                            }
                        })
                        .run();
                },
                allow: ({ editor, range }) => {
                    return editor.can().insertContentAt(range, { type: 'dotContent' });
                },
                items: (param) => {
                    console.log({ param });
                    return [];
                },
                render: () => {
                    let myTippy;
                    return {
                        onStart: (props) => {
                            const factory = resolver.resolveComponentFactory(
                                SuggestionsComponent
                            );
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
        group: 'block',
        draggable: true,

        // ...configuration
        addAttributes() {
            return {
                data: {
                    default: null,
                    parseHTML: (element) => ({
                        data: element.getAttribute('data')
                    }),
                    renderHTML: (attributes) => {
                        return { data: attributes.data };
                    }
                }
            };
        },

        parseHTML() {
            console.log('parseHTML');
            return [{ tag: 'dotcms-contentlet-block' }];
        },

        renderHTML({ HTMLAttributes }) {
            console.log('renderHTML');
            return ['dotcms-contentlet-block', mergeAttributes(HTMLAttributes)];
        },

        addNodeView() {
            console.log('addNodeView');
            return AngularNodeViewRenderer(ContentletBlockComponent, { injector });
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
