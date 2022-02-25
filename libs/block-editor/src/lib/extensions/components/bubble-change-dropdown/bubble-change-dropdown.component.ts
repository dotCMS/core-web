import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    codeIcon,
    headerIcons,
    olIcon,
    pIcon,
    quoteIcon,
    ulIcon
} from '../suggestions/suggestion-icons';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Editor } from '@tiptap/core';
import { DotMenuItem, SuggestionsComponent } from '@dotcms/block-editor';
import { Level } from '@tiptap/extension-heading/src/heading';

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent implements OnInit {
    @Input() editor: Editor;

    @ViewChild('suggestions') suggestions: SuggestionsComponent;

    menuItems: DotMenuItem[];
    showSuggestions = false;
    selectedOption: DotMenuItem;

    constructor(private domSanitizer: DomSanitizer) {}

    ngOnInit(): void {
        const headings = [...Array(3).keys()].map((level: Level) => {
            const size: Level = (level + 1) as Level;
            return {
                label: `Heading ${size}`,
                icon: this.sanitizeUrl(headerIcons[level]),
                isActive: () => this.editor.isActive('heading', { level: size }),
                command: () => {
                    this.editor.chain().focus().clearNodes().setHeading({ level: size }).run();
                    this.showSuggestions = false;
                }
            };
        });

        const paragraph = [
            {
                label: 'Paragraph',
                icon: this.sanitizeUrl(pIcon),
                isActive: () => this.editor.isActive('paragraph', {}),
                command: () => {
                    console.log('setParagraph');
                    this.editor.chain().focus().clearNodes().setParagraph().run();
                    this.showSuggestions = false;
                }
            }
        ];

        const list = [
            {
                label: 'List Ordered',
                icon: this.sanitizeUrl(olIcon),
                isActive: () => this.editor.isActive('orderedList'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleOrderedList().run();
                    this.showSuggestions = false;
                }
            },
            {
                label: 'List Unordered',
                icon: this.sanitizeUrl(ulIcon),
                isActive: () => this.editor.isActive('bulletList'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleBulletList().run();
                    this.showSuggestions = false;
                }
            }
        ];

        const block = [
            {
                label: 'Blockquote',
                icon: this.sanitizeUrl(quoteIcon),
                isActive: () => this.editor.isActive('blockquote'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleBlockquote().run();
                    this.showSuggestions = false;
                }
            },
            {
                label: 'Code Block',
                icon: this.sanitizeUrl(codeIcon),
                isActive: () => this.editor.isActive('codeBlock'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleCodeBlock().run();
                    this.showSuggestions = false;
                }
            }
        ];

        this.menuItems = [...headings, ...paragraph, ...list, ...block];
        this.editor.on('transaction', () => {
            this.setSelectedItem();
        });
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
                    this.menuItems.findIndex((item) => item === this.selectedOption)
                );
            }, 0);
        }
    }

    private setSelectedItem(): void {
        const activeMarks = this.menuItems.filter((option) => option.isActive());
        // Needed because in some scenarios, paragraph and other mark (ex: blockquote)
        // can be active at the same time.
        this.selectedOption = activeMarks.length > 1 ? activeMarks[1] : activeMarks[0];
    }

    private sanitizeUrl(url: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
