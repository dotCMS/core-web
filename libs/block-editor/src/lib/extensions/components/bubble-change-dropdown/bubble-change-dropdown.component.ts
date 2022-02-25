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

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent implements OnInit {
    @Input() editor: Editor;

    @ViewChild('suggestions', { static: false }) suggestions: SuggestionsComponent;

    options: DotMenuItem[];
    showList = false;
    selectedOption: DotMenuItem;

    constructor(private domSanitizer: DomSanitizer) {}

    ngOnInit(): void {
        const headings = [...Array(3).keys()].map((level) => {
            const size = level + 1;
            return {
                label: `Heading ${size}`,
                icon: this.sanitizeUrl(headerIcons[level]),
                isActive: () => this.editor.isActive('heading', { level: size as number }),
                command: () => {
                    this.editor
                        .chain()
                        .focus()
                        .setHeading({ level: size as number })
                        .run();
                    this.showList = false;
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
                    this.showList = false;
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
                    this.showList = false;
                }
            },
            {
                label: 'List Unordered',
                icon: this.sanitizeUrl(ulIcon),
                isActive: () => this.editor.isActive('bulletList'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleBulletList().run();
                    this.showList = false;
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
                    this.showList = false;
                }
            },
            {
                label: 'Code Block',
                icon: this.sanitizeUrl(codeIcon),
                isActive: () => this.editor.isActive('codeBlock'),
                command: () => {
                    this.editor.chain().focus().clearNodes().toggleCodeBlock().run();
                    this.showList = false;
                }
            }
        ];

        this.options = [...headings, ...paragraph, ...list, ...block];
        this.editor.on('transaction', () => {
            this.setSelectedItem();
        });
    }

    onShowList() {
        this.showList = !this.showList;
        if (this.showList) {
            setTimeout(() => {
                this.suggestions.updateActiveItem(
                    this.options.findIndex((item) => item === this.selectedOption)
                );
            }, 0);
        }
    }

    private setSelectedItem(): void {
        const activeMarks = this.options.filter((option) => option.isActive());
        // Needed because in some scenarios, paragraph and other mark (ex: blockquote)
        // can be active at the same time.
        this.selectedOption = activeMarks.length > 1 ? activeMarks[1] : activeMarks[0];

        console.log('active marks', activeMarks[0]);
        console.log('this.selectedOption: ', this.selectedOption);
    }

    private sanitizeUrl(url: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
