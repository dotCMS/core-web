import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { map, take } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

import { SuggestionsService } from '../../services/suggestions.service';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { SuggestionListComponent } from '../suggestion-list/suggestion-list.component';

@Component({
    selector: 'dotcms-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
    @ViewChild('list', { static: true }) list: SuggestionListComponent;

    @Input() command: ({
        payload,
        type
    }: {
        payload?: DotCMSContentlet;
        type: { name: string; level?: number };
    }) => void;
    items: MenuItem[] = [];

    constructor(private suggestionsService: SuggestionsService, private cd: ChangeDetectorRef) {
    }

    onKeyDown(e: KeyboardEvent) {
        this.list.onKeydown(e);
    }

    setFirstItemActive() {
        this.list.setFirstItemActive();
    }

    resetKeyManager() {
        this.list.resetKeyManager();
    }

    onMouseEnter(e: MouseEvent) {
        const index = Number((e.target as HTMLElement).dataset.index);
        console.log(index);
        this.list.updateActiveItem(index);
    }

    onClick(e: MouseEvent, item: MenuItem) {
        // console.log('click', item);
        item.command()
    }

    ngOnInit(): void {
        const headings = [...Array(3).keys()].map((level) => {
            const size = level + 1;
            return {
                label: `Heading ${size}`,
                icon: `/assets/block-editor/h${size}.svg`,
                command: () => {
                    this.command({
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
                icon: `/assets/block-editor/p.svg`,
                command: () => {
                    this.command({
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
                icon: `/assets/block-editor/ol.svg`,
                command: () => {
                    this.command({
                        type: {
                            name: 'listOrdered'
                        }
                    });
                }
            },
            {
                label: 'List Unordered',
                icon: `/assets/block-editor/ul.svg`,
                command: () => {
                    this.command({
                        type: {
                            name: 'listUnordered'
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
            ...list
        ];
    }

    private initContentletSelection() {
        this.suggestionsService
            .getContentTypes()
            .pipe(
                map((items) => {
                    return items.map((item) => {
                        return {
                            label: item['name'],
                            icon: item['icon'],
                            command: () => {
                                this.suggestionsService
                                    .getContentlets(item['variable'])
                                    .pipe(take(1))
                                    .subscribe((contentlets) => {
                                        this.items = contentlets.map((contentlet) => {
                                            return {
                                                label: contentlet['title'],
                                                icon: 'image',
                                                command: () => {
                                                    this.command({
                                                        payload: contentlet,
                                                        type: {
                                                            name: 'dotContent'
                                                        }
                                                    });
                                                }
                                            };
                                        });

                                        this.cd.detectChanges();
                                        this.resetKeyManager();
                                    });
                            }
                        };
                    });
                }),
                take(1)
            )
            .subscribe((items) => {
                this.items = items;
                this.cd.detectChanges();
                this.resetKeyManager();
            });
    }
}
