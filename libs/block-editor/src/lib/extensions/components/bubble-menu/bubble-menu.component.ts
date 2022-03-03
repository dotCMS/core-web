import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Editor } from '@tiptap/core';
import { bubbleMenuItems, bubbleMenuImageItems } from '@dotcms/block-editor';

export interface BubbleMenuItem {
    icon: string;
    markAction: string;
    active: boolean;
    divider?: boolean;
}

@Component({
    selector: 'dotcms-bubble-menu',
    templateUrl: './bubble-menu.component.html',
    styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent implements OnInit, OnDestroy {
    @Input() editor: Editor;
    @Input() items: BubbleMenuItem[] = [];
    @Output() editorCommand: EventEmitter<any> = new EventEmitter();

    public textAlings: string[] = ['left', 'center', 'right'];

    ngOnInit() {
        // this.setEnabledMarks();

        /**
         * Every time the editor is updated, the active state of the buttons must be updated.
         */

        /**
         * Every time the selection is updated, check if it's a dotImage
         */
        this.editor.on('selectionUpdate', this.setMenuItems.bind(this));
    }

    ngOnDestroy(): void {
        this.editor.off('selectionUpdate', this.setMenuItems.bind(this));
    }

    preventDeSelection(event: MouseEvent): void {
        event.preventDefault();
    }

    private setMenuItems({ editor: { state } }: { editor: Editor }): void {
        const { doc, selection } = state;
        const { empty } = selection;

        if (empty) {
            return;
        }

        const node = doc.nodeAt(selection.from);
        const isDotImage = node.type.name == 'dotImage';

        this.items = isDotImage ? bubbleMenuImageItems : bubbleMenuItems;
    }

    private toggleTextAlign(aligment: string, active: boolean): void {
        if (active) {
            this.editor.commands.unsetTextAlign();
        } else {
            this.editor.commands.setTextAlign(aligment);
        }
    }

    private isListNode(): boolean {
        return this.editor.isActive('bulletList') || this.editor.isActive('orderedList');
    }
}
