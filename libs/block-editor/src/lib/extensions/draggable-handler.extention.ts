import { Node, mergeAttributes } from '@tiptap/core';

export const DraggableHandler = Node.create({
    name: 'draggableHandler',

    group: 'block',

    content: 'block+',

    draggable: true,

    parseHTML() {
        return [
            {
                tag: '[data-type="draggable-item"]'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-item' }), 0];
    },

    addNodeView() {
        return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {
            const dom = document.createElement('div');

            dom.innerHTML = 'Drag';

            return {
                dom
            };
        };
    }
});
