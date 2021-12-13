import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';

// Interfaces
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DropdownComponent } from '../dropdown/dropdown.component';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface BubbleMenuItem {
    icon: string;
    type: string;
    active: boolean;
    divider?: boolean;
}

export interface MenuActionProps {
    type: string;
    active?: boolean;
    payload?: DotCMSContentlet
    level: number;
}

@Component({
    selector: 'dotcms-bubble-menu',
    templateUrl: './bubble-menu.component.html',
    styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent implements OnInit {
    @Input() editor: Editor;
    @ViewChild('dropdownComponent') dropdownComponent: DropdownComponent;

    public editorParent : Element;
    public enabledMarks : string[] = [];
    public textAlings   : string[] = ['left', 'center', 'right'];
    public activeMarks  : string[] = [];

    public items: BubbleMenuItem[] = [
        {
            icon: 'format_bold',
            type: 'bold',
            active: false
        },
        {
            icon: 'format_underlined',
            type: 'underline',
            active: false
        },
        {
            icon: 'format_italic',
            type: 'italic',
            active: false
        },
        {
            icon: 'strikethrough_s',
            type: 'strike',
            active: false,
            divider: true
        },
        {
            icon: 'format_align_left',
            type: 'left',
            active: false
        },
        {
            icon: 'format_align_center',
            type: 'center',
            active: false
        },
        {
            icon: 'format_align_right',
            type: 'right',
            active: false,
            divider: true
        },
        {
            icon: 'format_list_bulleted',
            type: 'bulletList',
            active: false
        },
        {
            icon: 'format_list_numbered',
            type: 'orderedList',
            active: false
        },
        {
            icon: 'format_indent_decrease',
            type: 'outdent',
            active: false
        },
        {
            icon: 'format_indent_increase',
            type: 'indent',
            active: false,
            divider: true
        },
        {
            icon: 'link',
            type: 'link',
            active: false,
            divider: true
        },
        {
            icon: 'format_clear',
            type: 'clearAll',
            active: false
        }
    ];

    ngOnInit() {
        this.editor.on('create', () => this.editorParent = this.editor.options.element);
        this.setEnabledMarks();

        /**
         * Every time the selection is updated, the active state of the buttons must be updated.
         */
        this.editor.on('transaction', () => {
            this.setActiveMarks();
            this.updateActiveItems();
        });
        
        this.editor.view.setProps({
            handleKeyDown: (view, event) => {
                return this.dropdownComponent.onKeyDown(event);
            }
        })
    }

    command(item: MenuActionProps): void {
        this.menuActions(item);
        this.setActiveMarks();
        this.updateActiveItems();
    }

    preventDeSelection(event: MouseEvent): void {
        event.preventDefault();
    }

    private menuActions(item: MenuActionProps): void {
        const actions = {
            bold: () => {
                this.editor.commands.toggleBold();
            },
            heading: () => {
                this.editor.commands.setHeading({ level: item.level as Level });
            },
            italic: () => {
                this.editor.commands.toggleItalic();
            },
            strike: () => {
                this.editor.commands.toggleStrike();
            },
            underline: () => {
                this.editor.commands.toggleUnderline();
            },
            left: () => {
                this.toggleTextAlign('left', item.active);
            },
            center: () => {
                this.toggleTextAlign('center', item.active);
            },
            right: () => {
                this.toggleTextAlign('right', item.active);
            },
            bulletList: () => {
                this.editor.commands.toggleBulletList();
            },
            orderedList: () => {
                this.editor.commands.toggleOrderedList();
            },
            indent: () => {
                if (this.isListNode()) {
                    this.editor.commands.sinkListItem('listItem');
                }
            },
            outdent: () => {
                if (this.isListNode()) {
                    this.editor.commands.liftListItem('listItem');
                }
            },
            link: () => {
                this.editor.commands.toogleLinkForm();
            },
            clearAll: () => {
                this.editor.commands.unsetAllMarks();
                this.editor.commands.clearNodes();
            }
        };

        actions[item.type] ? actions[item.type]() : null;
    }

    private updateActiveItems(): void {
        this.items.forEach((item) => {
            item.active = this.activeMarks.includes(item.type);
        });
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

    private setEnabledMarks(): void {
        this.enabledMarks = [
            ...Object.keys(this.editor.schema.marks),
            ...Object.keys(this.editor.schema.nodes)
        ];
    }

    private setActiveMarks(): void {
        this.activeMarks = [
            ...this.enabledMarks.filter((mark) => this.editor.isActive(mark)),
            ...this.textAlings.filter((alignment) => this.editor.isActive({ textAlign: alignment }))
        ];
    }
}