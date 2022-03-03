import { Attribute, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';
import {
    bubbleMenuItems,
    bubbleMenuImageItems,
    DotMenuItem,
    suggestionOptions,
    SuggestionsComponent
} from '@dotcms/block-editor';
import { BubbleChangeDropdownComponent } from '../bubble-change-dropdown/bubble-change-dropdown.component';

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
export class BubbleMenuComponent implements OnInit {
    @Input() editor: Editor;
    @ViewChild('dropdown') dropdown: BubbleChangeDropdownComponent;

    @Attribute('isDropDownOpen') isDropDownOpen = true;

    public enabledMarks: string[] = [];
    public textAlings: string[] = ['left', 'center', 'right'];
    public activeMarks: string[] = [];
    public dropdownOptions: DotMenuItem[];
    public selectedOption: DotMenuItem;

    public items: BubbleMenuItem[] = [];

    ngOnInit() {
        this.setEnabledMarks();

        const dropDownOptionsCommand = {
            heading1: () => {
                this.editor.chain().focus().clearNodes().setHeading({ level: 1 }).run();
            },
            heading2: () => {
                this.editor.chain().focus().clearNodes().setHeading({ level: 2 }).run();
            },
            heading3: () => {
                this.editor.chain().focus().clearNodes().setHeading({ level: 3 }).run();
            },
            paragraph: () => {
                this.editor.chain().focus().clearNodes().setParagraph().run();
            },
            listOrdered: () => {
                this.editor.chain().focus().clearNodes().toggleOrderedList().run();
            },
            listUnordered: () => {
                this.editor.chain().focus().clearNodes().toggleBulletList().run();
            },
            blockQuote: () => {
                this.editor.chain().focus().clearNodes().toggleBlockquote().run();
            },
            codeBlock: () => {
                this.editor.chain().focus().clearNodes().toggleCodeBlock().run();
            }
        };
        this.dropdownOptions = suggestionOptions;
        this.dropdownOptions.forEach((option) => {
            option.isActive = () => {
                //TODO: find active
                if (option.id.includes('heading')) {
                    const a = this.editor.isActive({
                        name: 'heading',
                        level: parseInt(option.id.slice(-1))
                    });
                    //  console.log(a);
                    return a;
                }
                return false;
                // return this.editor.isActive(option.id);
            };
            option.command = () => {
                dropDownOptionsCommand[option.id]();
                this.dropdown.toggleSuggestions();
                this.setSelectedItem();
            };
        });

        this.editor.view.setProps({
            handleKeyDown: (view, event) => {
                const { key } = event;
                console.log('-----Bubble-----');
                if (this.dropdown?.showSuggestions) {
                    if (key === 'Enter') {
                        this.dropdown.suggestions.execCommand();
                        return true;
                    }

                    if (key === 'ArrowDown' || key === 'ArrowUp') {
                        this.dropdown.updateSelection(event);
                        return true;
                    }

                    if (key === 'Escape') {
                        this.dropdown.toggleSuggestions();
                        return true;
                    }
                }

                if (this.dropdown?.showSuggestions && (key === 'ArrowDown' || key === 'ArrowUp')) {
                    console.log('handleKeyDown', event);

                    return true;
                }
                return false;
            }
        });

        /**
         * Every time the editor is updated, the active state of the buttons must be updated.
         */
        this.editor.on('transaction', () => {
            this.setActiveMarks();
            this.updateActiveItems();
            this.setSelectedItem();
        });

        /**
         * Every time the selection is updated, check if it's a dotImage
         */
        this.editor.on('selectionUpdate', ({ editor: { state } }) => {
            const { doc, selection } = state;
            const { empty } = selection;

            if (empty) {
                return;
            }

            const node = doc.nodeAt(selection.from);
            const isDotImage = node.type.name == 'dotImage';

            this.items = isDotImage ? bubbleMenuImageItems : bubbleMenuItems;
        });
    }

    command(item: BubbleMenuItem): void {
        this.menuActions(item);
        this.setActiveMarks();
        this.updateActiveItems();
    }

    preventDeSelection(event: MouseEvent): void {
        event.preventDefault();
    }

    private menuActions(item: BubbleMenuItem): void {
        const markActions = {
            bold: () => {
                this.editor.commands.toggleBold();
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

        markActions[item.markAction] ? markActions[item.markAction]() : null;
    }

    private setDropDown() {}

    private updateActiveItems(): void {
        this.items.forEach((item) => {
            if (this.activeMarks.includes(item.markAction)) {
                item.active = true;
            } else {
                item.active = false;
            }
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

    private setSelectedItem(): void {
        const activeMarks = this.dropdownOptions.filter((option) => option.isActive());
        // Needed because in some scenarios, paragraph and other mark (ex: blockquote)
        // can be active at the same time.
        this.selectedOption = activeMarks.length > 1 ? activeMarks[1] : activeMarks[0];
        //  console.log(this.selectedOption);
    }
}
