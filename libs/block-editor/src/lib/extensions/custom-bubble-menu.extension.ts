import { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection, posToDOMRect } from '@tiptap/core';
import { PluginKey, Plugin, EditorState } from 'prosemirror-state';
import BubbleMenu, { BubbleMenuOptions, BubbleMenuView } from '@tiptap/extension-bubble-menu';
import { getNodeBoundingClientRect } from '@dotcms/block-editor';

export const CustomBubbleMenu = BubbleMenu.extend<BubbleMenuOptions>({
    addProseMirrorPlugins() {
        if (!this.options.element) {
            return [];
        }

        return [
            BubbleMenuPlugin({
                pluginKey: this.options.pluginKey,
                editor: this.editor,
                element: this.options.element,
                tippyOptions: this.options.tippyOptions,
                shouldShow: this.options.shouldShow
            })
        ];
    }
});

const BubbleMenuPlugin = (options: BubbleMenuPluginProps) => {
    return new Plugin({
        key:
            typeof options.pluginKey === 'string'
                ? new PluginKey(options.pluginKey)
                : options.pluginKey,
        view: (view) => new BubbleMenuViewCustom({ view, ...options })
    });
};

class BubbleMenuViewCustom extends BubbleMenuView {
    /* @Overrrider */
    update(view: EditorView, oldState?: EditorState) {
        const { state, composing } = view;
        const { doc, selection } = state;
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

        if (composing || isSame) {
            return;
        }

        this.createTooltip();

        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));

        const shouldShow = this.shouldShow?.({
            editor: this.editor,
            view,
            state,
            oldState,
            from,
            to
        });

        if (!shouldShow) {
            this.hide();

            return;
        }

        this.tippy?.setProps({
            getReferenceClientRect: () => {
                if (isNodeSelection(state.selection)) {
                    const node = view.nodeDOM(from) as HTMLElement;

                    if (node) {
                        const type = state.doc.nodeAt(from).type.name;
                        return getNodeBoundingClientRect(node, type);
                    }
                }

                return posToDOMRect(view, from, to);
            }
        });

        this.show();
    }
}

//const img = node.getElementsByTagName('img')[0];
