import { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection, posToDOMRect } from '@tiptap/core';
import { PluginKey, Plugin, EditorState } from 'prosemirror-state';
import { BubbleMenuView } from '@tiptap/extension-bubble-menu';

// Utils
import { getNodePosition } from '@dotcms/block-editor';
import { BubbleMenuComponent } from '../extensions/components/bubble-menu/bubble-menu.component';

export const DotBubbleMenuPlugin = (options: BubbleMenuPluginProps) => {
    return new Plugin({
        key:
            typeof options.pluginKey === 'string'
                ? new PluginKey(options.pluginKey)
                : options.pluginKey,
        view: (view) => new DotBubbleMenuPluginView({ view, ...options }),
        props: {
            /**
             * Catch and handle the keydown in the plugin
             *
             * @param {EditorView} view
             * @param {KeyboardEvent} event
             * @return {*}
             */
            handleKeyDown(view: EditorView, event: KeyboardEvent) {
                //const { open, range } = this.getState(view.state);
                const bubbleMenuComponent: BubbleMenuComponent =
                    options.element as unknown as BubbleMenuComponent;
                // console.log('event view', view);
                // console.log('event', event);
                // console.log('showSuggestions', bubbleMenuComponent);
                // setTimeout(() => {
                //     console.log('showSuggestions 2: ', bubbleMenuComponent.dropdown);
                // }, 10);
                console.log('options.pluginKe', options.pluginKey);
                console.log('options.tippyOptions', options.tippyOptions);

                if (bubbleMenuComponent.dropdown?.showSuggestions) {
                    event.stopPropagation();
                    event.preventDefault();
                    console.log('handle key down', view);
                    console.log('handle key down', event);
                }

                return false;

                // if (!open) {
                //     return false;
                // }
                // return options.render().onKeyDown({ event, range, view });
            }
        }
    });
};

export class DotBubbleMenuPluginView extends BubbleMenuView {
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
                if (isNodeSelection(selection)) {
                    const node = view.nodeDOM(from) as HTMLElement;

                    if (node) {
                        const type = doc.nodeAt(from).type.name;
                        return getNodePosition(node, type);
                    }
                }

                return posToDOMRect(view, from, to);
            }
        });

        this.show();
    }
}
