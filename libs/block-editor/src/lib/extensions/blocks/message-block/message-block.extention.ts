import { Node, mergeAttributes, NodeViewRenderer } from '@tiptap/core';
import { Injector } from '@angular/core';
import { DOMOutputSpec } from 'prosemirror-model';
import { AngularNodeViewRenderer } from '@dotcms/block-editor';
import { MessageBlockComponent } from './message-block.component';

export const MessageBlock = (injector: Injector): Node => {
    return Node.create({
        name: 'dotMessage',
        group: 'block',
        inline: false,

        addAttributes() {
            return {
                data: {
                    default: null,
                    parseHTML: (element) => {
                        data: element.getAttribute('data');
                    },
                    renderHTML: (attributes) => {
                        return { data: attributes.data };
                    }
                }
            };
        },

        renderHTML({ HTMLAttributes }): DOMOutputSpec {
            return ['dotcms-message', mergeAttributes(HTMLAttributes)];
        },

        addNodeView(): NodeViewRenderer {
            return AngularNodeViewRenderer(MessageBlockComponent, { injector });
        }
    });
};
