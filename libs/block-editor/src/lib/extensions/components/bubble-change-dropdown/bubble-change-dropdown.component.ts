import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DotMenuItem, SuggestionsComponent } from '@dotcms/block-editor';

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent implements OnInit {
    @Input() options: DotMenuItem[];
    @Input() selectedOption: DotMenuItem;
    @Output() selected: EventEmitter<DotMenuItem> = new EventEmitter(false);

    @ViewChild('suggestions') suggestions: SuggestionsComponent;

    showSuggestions = false;

    constructor() {}

    ngOnInit(): void {
        // const headings = [...Array(3).keys()].map((level: Level) => {
        //     const size: Level = (level + 1) as Level;
        //     return {
        //         label: `Heading ${size}`,
        //         icon: this.sanitizeUrl(headerIcons[level]),
        //         isActive: () => this.editor.isActive('heading', { level: size }),
        //         command: () => {
        //             this.editor.chain().focus().clearNodes().setHeading({ level: size }).run();
        //             this.showSuggestions = false;
        //         }
        //     };
        // });
        //
        // const paragraph = [
        //     {
        //         label: 'Paragraph',
        //         icon: this.sanitizeUrl(pIcon),
        //         isActive: () => this.editor.isActive('paragraph', {}),
        //         command: () => {
        //             console.log('setParagraph');
        //             this.editor.chain().focus().clearNodes().setParagraph().run();
        //             this.showSuggestions = false;
        //         }
        //     }
        // ];
        //
        // const list = [
        //     {
        //         label: 'List Ordered',
        //         icon: this.sanitizeUrl(olIcon),
        //         isActive: () => this.editor.isActive('orderedList'),
        //         command: () => {
        //             this.editor.chain().focus().clearNodes().toggleOrderedList().run();
        //             this.showSuggestions = false;
        //         }
        //     },
        //     {
        //         label: 'List Unordered',
        //         icon: this.sanitizeUrl(ulIcon),
        //         isActive: () => this.editor.isActive('bulletList'),
        //         command: () => {
        //             this.editor.chain().focus().clearNodes().toggleBulletList().run();
        //             this.showSuggestions = false;
        //         }
        //     }
        // ];
        //
        // const block = [
        //     {
        //         label: 'Blockquote',
        //         icon: this.sanitizeUrl(quoteIcon),
        //         isActive: () => this.editor.isActive('blockquote'),
        //         command: () => {
        //             this.editor.chain().focus().clearNodes().toggleBlockquote().run();
        //             this.showSuggestions = false;
        //         }
        //     },
        //     {
        //         label: 'Code Block',
        //         icon: this.sanitizeUrl(codeIcon),
        //         isActive: () => this.editor.isActive('codeBlock'),
        //         command: () => {
        //             this.editor.chain().focus().clearNodes().toggleCodeBlock().run();
        //             this.showSuggestions = false;
        //         }
        //     }
        // ];
        //
        // this.menuItems = [...headings, ...paragraph, ...list, ...block];
        // this.editor.on('transaction', () => {
        //     this.setSelectedItem();
        // });

        // this.editor.on('create', (editor: any) => {
        //     console.log('create: ', editor);
        //     this.editor.options.element.addEventListener('keydown', (event: KeyboardEvent) => {
        //         const { key } = event;
        //         if (this.showSuggestions) {
        //             if (key === 'Escape') {
        //                 this.showSuggestions = false;
        //                 return true;
        //             }
        //
        //             if (key === 'Enter') {
        //                 this.suggestions.execCommand();
        //                 event.preventDefault();
        //                 event.stopPropagation();
        //                 return false;
        //             }
        //
        //             if (key === 'ArrowDown' || key === 'ArrowUp') {
        //                 this.suggestions.updateSelection(event);
        //                 return true;
        //             }
        //
        //             return false;
        //         }
        //     });
        // });

        console.log('test');
    }

    /**
     * Update the current item selected
     *
     * @param {KeyboardEvent} event
     * @memberof BubbleChangeDropdownComponent
     */
    updateSelection(event: KeyboardEvent) {
        this.suggestions.updateSelection(event);
    }

    /**
     * Toggle the visibility of the Suggestions.
     *
     * @memberof BubbleChangeDropdownComponent
     */
    toggleSuggestions() {
        this.showSuggestions = !this.showSuggestions;
        if (this.showSuggestions) {
            setTimeout(() => {
                this.suggestions.updateActiveItem(
                    this.options.findIndex((item) => item === this.selectedOption)
                );
            }, 0);
        }
    }
}
