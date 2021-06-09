import { mergeAttributes, Node } from '@tiptap/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

export const DotContent = Node.create({
    name: 'dotContent',
    defaultOptions: {
        HTMLAttributes: {},
        value: ''
    },
    group: 'block',
    draggable: true,

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
        return [{ tag: 'dot-content' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['dot-content', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addNodeView() {
        return ({ node }) => {
            let markup = document.createElement('div');
            markup.className = 'dot-content';

            if (node.attrs.data) {
                const data: DotCMSContentlet = node.attrs.data;
                markup.innerHTML = `<img src='https://demo.dotcms.com//dA/${data.identifier}/100wh'>
                          <div>
                            <h3>${data.title}</h3>
                            <span>${data.inode}</span>
                          </div>`;
            }

            return {
                dom: markup,
                update: (updatedNode) => {
                    console.log('update', updatedNode);
                }
            };
        };
    }
});
