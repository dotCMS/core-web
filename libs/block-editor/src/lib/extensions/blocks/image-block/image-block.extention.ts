import { Node, mergeAttributes, NodeViewRenderer } from '@tiptap/core';
import { Injector } from '@angular/core';
import { DOMOutputSpec, ParseRule } from 'prosemirror-model';
import { ImageBlockComponent } from './image-block.component';
import { AngularNodeViewRenderer } from '../../../NodeViewRenderer';

export const ImageBlock = (injector: Injector): Node => {
    return Node.create({
        name: 'dotImage',
        group: 'block',
        inline: false,
        draggable: true,

        addAttributes() {
            return {
                data: {
                    default: null,
                    parseHTML: (element) =>  element.getAttribute('data'),
                    renderHTML: (attributes) => {
                        return { data: attributes.data };
                    }
                },
            };
        },

        parseHTML(): ParseRule[] {
            return [{ tag: 'dotcms-image-block' }];
        },

        renderHTML({ HTMLAttributes }) {
            const containerHTMLAttributes = { style: HTMLAttributes.style || null }
            return [
                'div', containerHTMLAttributes,
                [ 'dotcms-image-block', HTMLAttributes ]
            ]
        },

        addNodeView(): NodeViewRenderer {
            return AngularNodeViewRenderer(ImageBlockComponent, { injector });
        }
    });
};
