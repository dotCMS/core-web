import { Editor, isTextSelection } from '@tiptap/core';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

interface ShouldShowProps {
    editor: Editor;
    view: EditorView<any>;
    state: EditorState<any>;
    oldState?: EditorState<any>;
    from: number;
    to: number;
}

export const shouldShowBubbleMenu = ({ editor, state, from, to }: ShouldShowProps) => {

    const { doc, selection } = state
    const { empty } = selection

    // Current selected node
    const node = editor.state.doc.nodeAt(editor.state.selection.from);

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock = !doc.textBetween(from, to).length
    && isTextSelection(state.selection)


    // If it's empty or the current node is type dotContent, it will not open.
    if (empty || isEmptyTextBlock || node.type.name == 'dotContent') {
        return false
    }

    return true;

};

export const bubbleMenuItems = [
    {
        icon: 'format_bold',
        markAction: 'bold',
        active: false
    },
    {
        icon: 'format_underlined',
        markAction: 'underline',
        active: false
    },
    {
        icon: 'format_italic',
        markAction: 'italic',
        active: false
    },
    {
        icon: 'strikethrough_s',
        markAction: 'strike',
        active: false,
        divider: true
    },
    {
        icon: 'format_align_left',
        markAction: 'left',
        active: false
    },
    {
        icon: 'format_align_center',
        markAction: 'center',
        active: false
    },
    {
        icon: 'format_align_right',
        markAction: 'right',
        active: false,
        divider: true
    },
    {
        icon: 'format_list_bulleted',
        markAction: 'bulletList',
        active: false
    },
    {
        icon: 'format_list_numbered',
        markAction: 'orderedList',
        active: false
    },
    {
        icon: 'format_indent_decrease',
        markAction: 'outdent',
        active: false
    },
    {
        icon: 'format_indent_increase',
        markAction: 'indent',
        active: false,
        divider: true
    },
    {
        icon: 'link',
        markAction: 'link',
        active: false,
        divider: true
    },
    {
        icon: 'format_clear',
        markAction: 'clearAll',
        active: false
    }
];

export const bubbleMenuImageItems = [
    {
        icon: 'format_align_left',
        markAction: 'left',
        active: false
    },
    {
        icon: 'format_align_center',
        markAction: 'center',
        active: false
    },
    {
        icon: 'format_align_right',
        markAction: 'right',
        active: false,
        divider: true
    },
    {
        icon: 'link',
        markAction: 'link',
        active: false,
    },
];