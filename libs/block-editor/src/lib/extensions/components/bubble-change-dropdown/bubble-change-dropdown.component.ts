import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
import { DotMenuItem } from '@dotcms/block-editor';

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent implements OnInit {
    @Input() editor: Editor;
    options: DotMenuItem[];
    selectedOption: DotMenuItem;

    constructor(private domSanitizer: DomSanitizer) {}

    ngOnInit(): void {
        const headings = [...Array(3).keys()].map((level) => {
            const size = level + 1;
            return {
                label: `Heading ${size}`,
                icon: this.sanitizeUrl(headerIcons[level]),
                isActive: () => this.editor.isActive('heading', { level: size as any }),
                command: () => {
                    this.editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: size as any })
                        .run();
                }
            };
        });

        const paragraph = [
            {
                label: 'Paragraph',
                icon: this.sanitizeUrl(pIcon),
                isActive: () => this.editor.isActive('paragraph'),
                command: () => {
                    this.editor.chain().focus().setParagraph().run();
                }
            }
        ];

        const list = [
            {
                label: 'List Ordered',
                icon: this.sanitizeUrl(olIcon),
                isActive: () => this.editor.isActive('orderedList'),
                command: () => {
                    this.editor.chain().focus().toggleOrderedList().run();
                }
            },
            {
                label: 'List Unordered',
                icon: this.sanitizeUrl(ulIcon),
                isActive: () => this.editor.isActive('bulletList'),
                command: () => {
                    this.editor.chain().focus().toggleBulletList().run();
                }
            }
        ];

        const block = [
            {
                label: 'Blockquote',
                icon: this.sanitizeUrl(quoteIcon),
                isActive: () => this.editor.isActive('blockquote'),
                command: () => {
                    this.editor.chain().focus().toggleBlockquote().run();
                }
            },
            {
                label: 'Code Block',
                icon: this.sanitizeUrl(codeIcon),
                isActive: () => this.editor.isActive('codeBlock'),
                command: () => {
                    this.editor.chain().focus().toggleCodeBlock().run();
                }
            }
        ];

        this.options = [...headings, ...paragraph, ...list, ...block];
        this.editor.on('transaction', () => {
            this.selectedOption = this.options.find((item) => item.isActive());
        });
    }

    /**
     * execute command of the selected value.
     *
     * @param {MenuItem} item
     * @memberof BubbleChangeDropdownComponent
     */
    onChange(item: MenuItem) {
        item.command();
    }

    private sanitizeUrl(url: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
