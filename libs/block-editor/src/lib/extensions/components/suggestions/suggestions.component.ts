import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    HostListener,
    AfterViewInit
} from '@angular/core';

import { map, take } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

import { SuggestionsService } from '../../services/suggestions/suggestions.service';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { SuggestionListComponent } from '../suggestion-list/suggestion-list.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
    headerIcons,
    pIcon,
    ulIcon,
    olIcon,
    quoteIcon,
    codeIcon,
    lineIcon
} from './suggestion-icons';

export interface SuggestionsCommandProps {
    payload?: DotCMSContentlet;
    type: { name: string; level?: number };
}

export interface DotMenuItem extends Omit<MenuItem, 'icon'> {
    icon: string | SafeUrl;
    isActive?: () => boolean;
}

@Component({
    selector: 'dotcms-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit, AfterViewInit {
    @ViewChild('list', { static: false }) list: SuggestionListComponent;

    @Input() onSelection: (props: SuggestionsCommandProps) => void;

    @Input() items: DotMenuItem[] = [];
    @Input() title = 'Select a block';

    mouseMove = true;

    @HostListener('mousemove', ['$event'])
    onMousemove() {
        this.mouseMove = true;
    }

    constructor(
        private suggestionsService: SuggestionsService,
        private cd: ChangeDetectorRef,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        if (this.items.length === 0) {
            const headings = [...Array(3).keys()].map((level) => {
                const size = level + 1;
                return {
                    label: `Heading ${size}`,
                    icon: this.sanitizeUrl(headerIcons[level]),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'heading',
                                level: level + 1
                            }
                        });
                    }
                };
            });

            const paragraph = [
                {
                    label: 'Paragraph',
                    icon: this.sanitizeUrl(pIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'paragraph'
                            }
                        });
                    }
                }
            ];

            const list = [
                {
                    label: 'List Ordered',
                    icon: this.sanitizeUrl(olIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'listOrdered'
                            }
                        });
                    }
                },
                {
                    label: 'List Unordered',
                    icon: this.sanitizeUrl(ulIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'listUnordered'
                            }
                        });
                    }
                }
            ];

            const block = [
                {
                    label: 'Blockquote',
                    icon: this.sanitizeUrl(quoteIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'blockQuote'
                            }
                        });
                    }
                },
                {
                    label: 'Code Block',
                    icon: this.sanitizeUrl(codeIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'codeBlock'
                            }
                        });
                    }
                },
                {
                    label: 'Horizontal Line',
                    icon: this.sanitizeUrl(lineIcon),
                    command: () => {
                        this.onSelection({
                            type: {
                                name: 'horizontalLine'
                            }
                        });
                    }
                }
            ];

            this.items = [
                {
                    label: 'Contentlets',
                    icon: 'receipt',
                    command: () => {
                        this.initContentletSelection();
                    }
                },
                ...headings,
                ...paragraph,
                ...list,
                ...block
            ];
        }
    }

    ngAfterViewInit() {
        this.setFirstItemActive();
    }

    /**
     * Execute the item command
     *
     * @memberof SuggestionsComponent
     */
    execCommand() {
        this.list.execCommand();
    }

    /**
     * Update the current item selected
     *
     * @param {KeyboardEvent} e
     * @memberof SuggestionsComponent
     */
    updateSelection(e: KeyboardEvent) {
        this.list.updateSelection(e);
        this.mouseMove = false;
    }

    /**
     * Set the first item active
     *
     * @memberof SuggestionsComponent
     */
    setFirstItemActive() {
        this.list.setFirstItemActive();
    }

    /**
     * Update the selected Index
     *
     * @memberof SuggestionsComponent
     */
    updateActiveItem(index: number): void {
        this.list.updateActiveItem(index);
    }

    /**
     * Reset the key manager after we add new elements to the list
     *
     * @memberof SuggestionsComponent
     */
    resetKeyManager() {
        this.list.resetKeyManager();
    }

    /**
     * Avoid closing the suggestions on manual scroll
     *
     * @param {MouseEvent} e
     * @memberof SuggestionsComponent
     */
    onMouseDownHandler(e: MouseEvent) {
        e.preventDefault();
    }

    /**
     * Handle the active item on menu events
     *
     * @param {MouseEvent} e
     * @memberof SuggestionsComponent
     */
    onMouseEnter(e: MouseEvent) {
        // If mouse does not move then leave the function.
        if (!this.mouseMove) {
            return;
        }
        e.preventDefault();
        const index = Number((e.target as HTMLElement).dataset.index);
        this.updateActiveItem(index);
    }

    /**
     * Execute the item command on mouse down
     *
     * @param {MouseEvent} e
     * @param {MenuItem} item
     * @memberof SuggestionsComponent
     */
    onMouseDown(e: MouseEvent, item: MenuItem) {
        e.preventDefault();
        item.command();
    }

    /**
     * Go back to contentlet selection
     *
     * @param {MouseEvent} event
     * @memberof SuggestionsComponent
     */
    handleBackButton(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.initContentletSelection();
    }

    private initContentletSelection() {
        this.suggestionsService
            .getContentTypes()
            .pipe(
                map((items) => {
                    return items.map((item) => {
                        return {
                            label: item.name,
                            icon: item.icon,
                            command: () => {
                                this.suggestionsService
                                    .getContentlets(item.variable)
                                    .pipe(take(1))
                                    .subscribe((contentlets) => {
                                        this.items = contentlets.map((contentlet) => {
                                            return {
                                                label: contentlet.title,
                                                icon: 'image',
                                                command: () => {
                                                    this.onSelection({
                                                        payload: contentlet,
                                                        type: {
                                                            name: 'dotContent'
                                                        }
                                                    });
                                                }
                                            };
                                        });

                                        if (this.items.length) {
                                            this.title = 'Select a contentlet';
                                            this.cd.detectChanges();
                                            this.resetKeyManager();
                                        } else {
                                            this.title = `No results for <b>${item.name}</b>`;
                                            this.cd.detectChanges();
                                        }
                                    });
                            }
                        };
                    });
                }),
                take(1)
            )
            .subscribe((items) => {
                this.title = 'Select a content type';
                this.items = items;
                this.cd.detectChanges();
                this.resetKeyManager();
            });
    }

    private sanitizeUrl(url: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
