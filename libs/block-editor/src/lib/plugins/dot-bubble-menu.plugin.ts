import { BubbleMenuPluginProps, BubbleMenuViewProps } from '@tiptap/extension-bubble-menu';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection, posToDOMRect } from '@tiptap/core';
import { PluginKey, Plugin, EditorState } from 'prosemirror-state';
import { BubbleMenuView } from '@tiptap/extension-bubble-menu';

// Utils
import { getNodePosition } from '@dotcms/block-editor';
import { ComponentRef } from '@angular/core';
import { BubbleMenuItem } from '../extensions/components/bubble-menu/bubble-menu.component';
import { bubbleMenuImageItems, bubbleMenuItems } from '../utils/bubble-menu.utils';

export declare type DotBubbleMenuPluginProps<T = any> = BubbleMenuPluginProps & {
    component: ComponentRef<T>;
};

export declare type DotBubbleMenuViewProps<T = any> = BubbleMenuViewProps & {
    component: ComponentRef<T>;
};

export const DotBubbleMenuPlugin = (options: DotBubbleMenuPluginProps) => {
    return new Plugin({
        key:
            typeof options.pluginKey === 'string'
                ? new PluginKey(options.pluginKey)
                : options.pluginKey,
        view: (view) => new DotBubbleMenuPluginView({ view, ...options })
    });
};

export class DotBubbleMenuPluginView extends BubbleMenuView {
    public component: ComponentRef<any>;

    /* @Overrrider */
    constructor(props: DotBubbleMenuViewProps) {
        // Inherit the parent class
        super(props);

        // New Properties
        this.component = props.component;
        this.component.instance.items = bubbleMenuItems;
        this.subscribeComponentEvents();
    }

    /* @Overrrider */
    update(view: EditorView, oldState?: EditorState) {
        this.updateComponent();
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

    updateComponent() {
        const { items } = this.component.instance;
        const activeMarks = setActiveMarks(this.editor);
        this.component.instance.items = updateActiveItems(items, activeMarks);
        this.component.changeDetectorRef.detectChanges();
    }

    /* Custom Functions */
    subscribeComponentEvents() {
        this.component.instance.editorCommand.subscribe((event: BubbleMenuItem) => {
            bubbleMenuAction(this.editor, event.markAction);
        });
    }
}

// Temporal
const bubbleMenuAction = (editor, action) => {
    switch (action) {
        case 'bold':
            editor.commands.toggleBold();
            break;
        case 'italic':
            editor.commands.toggleItalic();
            break;
        case 'strike':
            editor.commands.toggleStrike();
            break;
        case 'underline':
            editor.commands.toggleUnderline();
            break;
        // case 'left':
        //     this.toggleTextAlign('left', item.active);
        // break;
        // case 'center':
        //     this.toggleTextAlign('center', item.active);
        // break;
        // case 'right':
        //     this.toggleTextAlign('right', item.active);
        // break;
        case 'bulletList':
            editor.commands.toggleBulletList();
            break;
        case 'orderedList':
            editor.commands.toggleOrderedList();
            break;
        // case 'indent':
        //     if (this.isListNode()) {
        //         this.editor.commands.sinkListItem('listItem');
        //     }
        // break;
        // case 'outdent':
        //     if (this.isListNode()) {
        //         this.editor.commands.liftListItem('listItem');
        //     }
        // break;
        case 'link':
            editor.commands.toogleLinkForm();
            break;
        case 'clearAll':
            editor.commands.unsetAllMarks();
            editor.commands.clearNodes();
            break;
    }
};

const enabledMarks = (editor): string[] => {
    return [...Object.keys(editor.schema.marks), ...Object.keys(editor.schema.nodes)];
};

const setActiveMarks = (editor): string[] => {
    return [
        ...enabledMarks(editor).filter((mark) => editor.isActive(mark))
        // ...this.textAlings.filter((alignment) => this.editor.isActive({ textAlign: alignment }))
    ];
};

const updateActiveItems = (
    items: BubbleMenuItem[] = [],
    activeMarks: string[]
): BubbleMenuItem[] => {
    return items.map((item) => {
        item.active = activeMarks.includes(item.markAction);
        return item;
    });
};
