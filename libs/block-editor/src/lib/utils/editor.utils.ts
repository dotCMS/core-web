import { EditorView } from 'prosemirror-view';
import { getNodeType } from '@tiptap/core';

interface insertNodeAtProps<T = Record<string, string>> {
    view: EditorView;
    position: number;
    type: string;
    meta: T;
}

export const insertNodeAt = ({ view, position, type, meta }: insertNodeAtProps) => {
    const { state } = view;
    const { schema, tr } = state;
    const imageNode = getNodeType(type, schema).create(meta);
    view.dispatch(tr.replaceRangeWith(position, position, imageNode));
};
