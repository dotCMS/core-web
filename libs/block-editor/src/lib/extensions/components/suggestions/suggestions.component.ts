import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { map, take } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

import { SuggestionsService } from '../../services/suggestions.service';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { SuggestionListComponent } from '../suggestion-list/suggestion-list.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface SuggestionsCommandProps {
    payload?: DotCMSContentlet;
    type: { name: string; level?: number };
}

export interface DotMenuItem  extends Omit<MenuItem, 'icon'> {
    icon: string | SafeUrl;
}

@Component({
    selector: 'dotcms-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
    @ViewChild('list', { static: true }) list: SuggestionListComponent;

    @Input() onSelection: (props: SuggestionsCommandProps) => void;
    items: DotMenuItem[] = [];

    title = 'Select a block';

    /* eslint-disable max-len */
    headerImages = ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjMyODEgMjJWMjEuMDE1Nkw3LjkwNjI1IDIwLjc5NjlWMTEuODM1OUw2LjYzMjgxIDExLjYxNzJWMTAuNjI1SDEwLjcxODhWMTEuNjE3Mkw5LjQ0NTMxIDExLjgzNTlWMTUuNzY1NkgxNC44ODI4VjExLjgzNTlMMTMuNjA5NCAxMS42MTcyVjEwLjYyNUgxNy42OTUzVjExLjYxNzJMMTYuNDIxOSAxMS44MzU5VjIwLjc5NjlMMTcuNjk1MyAyMS4wMTU2VjIySDEzLjYwOTRWMjEuMDE1NkwxNC44ODI4IDIwLjc5NjlWMTYuOTc2Nkg5LjQ0NTMxVjIwLjc5NjlMMTAuNzE4OCAyMS4wMTU2VjIySDYuNjMyODFaTTE5LjI3MzQgMjJWMjEuMDE1NkwyMS4wMzEyIDIwLjc5NjlWMTIuMjczNEwxOS4yNDIyIDEyLjMwNDdWMTEuMzQzOEwyMi41NzAzIDEwLjYyNVYyMC43OTY5TDI0LjMyMDMgMjEuMDE1NlYyMkgxOS4yNzM0WiIgZmlsbD0iIzIyMjIyMiIvPgo8L3N2Zz4K', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNjMyODEgMjJWMjEuMDE1Nkw2LjkwNjI1IDIwLjc5NjlWMTEuODM1OUw1LjYzMjgxIDExLjYxNzJWMTAuNjI1SDkuNzE4NzVWMTEuNjE3Mkw4LjQ0NTMxIDExLjgzNTlWMTUuNzY1NkgxMy44ODI4VjExLjgzNTlMMTIuNjA5NCAxMS42MTcyVjEwLjYyNUgxNi42OTUzVjExLjYxNzJMMTUuNDIxOSAxMS44MzU5VjIwLjc5NjlMMTYuNjk1MyAyMS4wMTU2VjIySDEyLjYwOTRWMjEuMDE1NkwxMy44ODI4IDIwLjc5NjlWMTYuOTc2Nkg4LjQ0NTMxVjIwLjc5NjlMOS43MTg3NSAyMS4wMTU2VjIySDUuNjMyODFaTTE4LjA4NTkgMjJWMjAuOTQ1M0wyMS44MTI1IDE2LjgwNDdDMjIuMjU1MiAxNi4zMDk5IDIyLjYwMTYgMTUuODg4IDIyLjg1MTYgMTUuNTM5MUMyMy4xMDE2IDE1LjE4NDkgMjMuMjc2IDE0Ljg2NDYgMjMuMzc1IDE0LjU3ODFDMjMuNDc0IDE0LjI5MTcgMjMuNTIzNCAxMy45OTQ4IDIzLjUyMzQgMTMuNjg3NUMyMy41MjM0IDEzLjExOTggMjMuMzUxNiAxMi42NDMyIDIzLjAwNzggMTIuMjU3OEMyMi42NjQxIDExLjg2NzIgMjIuMTcxOSAxMS42NzE5IDIxLjUzMTIgMTEuNjcxOUMyMC44NjQ2IDExLjY3MTkgMjAuMzQzOCAxMS44NzI0IDE5Ljk2ODggMTIuMjczNEMxOS41OTkgMTIuNjc0NSAxOS40MTQxIDEzLjI0MjIgMTkuNDE0MSAxMy45NzY2SDE3LjkzNzVMMTcuOTIxOSAxMy45Mjk3QzE3LjkwNjIgMTMuMjczNCAxOC4wNDQzIDEyLjY4NDkgMTguMzM1OSAxMi4xNjQxQzE4LjYyNzYgMTEuNjM4IDE5LjA0OTUgMTEuMjI0IDE5LjYwMTYgMTAuOTIxOUMyMC4xNTg5IDEwLjYxNDYgMjAuODIwMyAxMC40NjA5IDIxLjU4NTkgMTAuNDYwOUMyMi4zMDQ3IDEwLjQ2MDkgMjIuOTIxOSAxMC41OTkgMjMuNDM3NSAxMC44NzVDMjMuOTU4MyAxMS4xNDU4IDI0LjM1OTQgMTEuNTE4MiAyNC42NDA2IDExLjk5MjJDMjQuOTIxOSAxMi40NjYxIDI1LjA2MjUgMTMuMDEwNCAyNS4wNjI1IDEzLjYyNUMyNS4wNjI1IDE0LjI1IDI0Ljg3NzYgMTQuODcyNCAyNC41MDc4IDE1LjQ5MjJDMjQuMTQzMiAxNi4xMTIgMjMuNjI3NiAxNi43ODEyIDIyLjk2MDkgMTcuNUwxOS45Njg4IDIwLjc1NzhMMTkuOTg0NCAyMC43OTY5SDI0LjAyMzRMMjQuMTQ4NCAxOS40OTIySDI1LjQ1MzFWMjJIMTguMDg1OVoiIGZpbGw9IiMyMjIyMjIiLz4KPC9zdmc+Cg==', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNjMyODEgMjJWMjEuMDE1Nkw2LjkwNjI1IDIwLjc5NjlWMTEuODM1OUw1LjYzMjgxIDExLjYxNzJWMTAuNjI1SDkuNzE4NzVWMTEuNjE3Mkw4LjQ0NTMxIDExLjgzNTlWMTUuNzY1NkgxMy44ODI4VjExLjgzNTlMMTIuNjA5NCAxMS42MTcyVjEwLjYyNUgxNi42OTUzVjExLjYxNzJMMTUuNDIxOSAxMS44MzU5VjIwLjc5NjlMMTYuNjk1MyAyMS4wMTU2VjIySDEyLjYwOTRWMjEuMDE1NkwxMy44ODI4IDIwLjc5NjlWMTYuOTc2Nkg4LjQ0NTMxVjIwLjc5NjlMOS43MTg3NSAyMS4wMTU2VjIySDUuNjMyODFaTTIxLjQ2ODggMjIuMTY0MUMyMC43NzYgMjIuMTY0MSAyMC4xNTg5IDIyLjAzOTEgMTkuNjE3MiAyMS43ODkxQzE5LjA3NTUgMjEuNTMzOSAxOC42NTEgMjEuMTc0NSAxOC4zNDM4IDIwLjcxMDlDMTguMDQxNyAyMC4yNDIyIDE3Ljg5ODQgMTkuNjg3NSAxNy45MTQxIDE5LjA0NjlMMTcuOTM3NSAxOUgxOS40MDYyQzE5LjQwNjIgMTkuNTk5IDE5LjU4ODUgMjAuMDc1NSAxOS45NTMxIDIwLjQyOTdDMjAuMzIyOSAyMC43ODM5IDIwLjgyODEgMjAuOTYwOSAyMS40Njg4IDIwLjk2MDlDMjIuMTE5OCAyMC45NjA5IDIyLjYzMDIgMjAuNzgzOSAyMyAyMC40Mjk3QzIzLjM2OTggMjAuMDc1NSAyMy41NTQ3IDE5LjU1MjEgMjMuNTU0NyAxOC44NTk0QzIzLjU1NDcgMTguMTU2MiAyMy4zOTA2IDE3LjYzOCAyMy4wNjI1IDE3LjMwNDdDMjIuNzM0NCAxNi45NzE0IDIyLjIxNjEgMTYuODA0NyAyMS41MDc4IDE2LjgwNDdIMjAuMTY0MVYxNS42MDE2SDIxLjUwNzhDMjIuMTkwMSAxNS42MDE2IDIyLjY3MTkgMTUuNDMyMyAyMi45NTMxIDE1LjA5MzhDMjMuMjM5NiAxNC43NSAyMy4zODI4IDE0LjI3MzQgMjMuMzgyOCAxMy42NjQxQzIzLjM4MjggMTIuMzM1OSAyMi43NDQ4IDExLjY3MTkgMjEuNDY4OCAxMS42NzE5QzIwLjg2OTggMTEuNjcxOSAyMC4zODggMTEuODQ5IDIwLjAyMzQgMTIuMjAzMUMxOS42NjQxIDEyLjU1MjEgMTkuNDg0NCAxMy4wMTgyIDE5LjQ4NDQgMTMuNjAxNkgxOC4wMDc4TDE3Ljk5MjIgMTMuNTU0N0MxNy45NzY2IDEyLjk4MTggMTguMTEyIDEyLjQ2MDkgMTguMzk4NCAxMS45OTIyQzE4LjY5MDEgMTEuNTIzNCAxOS4wOTkgMTEuMTUxIDE5LjYyNSAxMC44NzVDMjAuMTU2MiAxMC41OTkgMjAuNzcwOCAxMC40NjA5IDIxLjQ2ODggMTAuNDYwOUMyMi41MjA4IDEwLjQ2MDkgMjMuMzU5NCAxMC43NDIyIDIzLjk4NDQgMTEuMzA0N0MyNC42MDk0IDExLjg2MiAyNC45MjE5IDEyLjY1ODkgMjQuOTIxOSAxMy42OTUzQzI0LjkyMTkgMTQuMTY0MSAyNC43Nzg2IDE0LjYzMjggMjQuNDkyMiAxNS4xMDE2QzI0LjIxMDkgMTUuNTY1MSAyMy43ODY1IDE1LjkxOTMgMjMuMjE4OCAxNi4xNjQxQzIzLjkwMSAxNi4zODggMjQuMzgyOCAxNi43Mzk2IDI0LjY2NDEgMTcuMjE4OEMyNC45NTA1IDE3LjY5NzkgMjUuMDkzOCAxOC4yMzQ0IDI1LjA5MzggMTguODI4MUMyNS4wOTM4IDE5LjUyMDggMjQuOTM3NSAyMC4xMTcyIDI0LjYyNSAyMC42MTcyQzI0LjMxNzcgMjEuMTEyIDIzLjg5MDYgMjEuNDk0OCAyMy4zNDM4IDIxLjc2NTZDMjIuNzk2OSAyMi4wMzEyIDIyLjE3MTkgMjIuMTY0MSAyMS40Njg4IDIyLjE2NDFaIiBmaWxsPSIjMjIyMjIyIi8+Cjwvc3ZnPgo=']
    olImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNzA4OTggMjAuNTMxMlYxOS43OTNMOC4wMjczNCAxOS42Mjg5VjEzLjIzNjNMNi42ODU1NSAxMy4yNTk4VjEyLjUzOTFMOS4xODE2NCAxMlYxOS42Mjg5TDEwLjQ5NDEgMTkuNzkzVjIwLjUzMTJINi43MDg5OFoiIGZpbGw9IiMyMjIyMjIiLz4KPHBhdGggZD0iTTExLjc5NDkgMjAuNTMxMlYxOS4zNDc3SDEyLjk0OTJWMjAuNTMxMkgxMS43OTQ5WiIgZmlsbD0iIzIyMjIyMiIvPgo8cmVjdCB4PSIxNSIgeT0iMTMiIHdpZHRoPSIxMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMjIyMjIyIi8+CjxyZWN0IHg9IjE1IiB5PSIxNiIgd2lkdGg9IjExIiBoZWlnaHQ9IjEiIGZpbGw9IiMyMjIyMjIiLz4KPHJlY3QgeD0iMTUiIHk9IjE5IiB3aWR0aD0iMTEiIGhlaWdodD0iMSIgZmlsbD0iIzIyMjIyMiIvPgo8L3N2Zz4K';
    ulImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTQiIHk9IjEyIiB3aWR0aD0iMTIiIGhlaWdodD0iMSIgZmlsbD0iIzIyMjIyMiIvPgo8cmVjdCB4PSIxNCIgeT0iMTUiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxIiBmaWxsPSIjMjIyMjIyIi8+CjxyZWN0IHg9IjE0IiB5PSIxOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEiIGZpbGw9IiMyMjIyMjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iMTUuNSIgcj0iMi41IiBmaWxsPSIjMjIyMjIyIi8+Cjwvc3ZnPgo=';
    pImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNDc0NjEgMTZWMTUuMjYxN0w3LjQyOTY5IDE1LjA5NzdWOC4zNzY5NUw2LjQ3NDYxIDguMjEyODlWNy40Njg3NUgxMC4zOTQ1QzExLjMwNDcgNy40Njg3NSAxMi4wMTE3IDcuNzAzMTIgMTIuNTE1NiA4LjE3MTg4QzEzLjAyMzQgOC42NDA2MiAxMy4yNzczIDkuMjU3ODEgMTMuMjc3MyAxMC4wMjM0QzEzLjI3NzMgMTAuNzk2OSAxMy4wMjM0IDExLjQxNiAxMi41MTU2IDExLjg4MDlDMTIuMDExNyAxMi4zNDU3IDExLjMwNDcgMTIuNTc4MSAxMC4zOTQ1IDEyLjU3ODFIOC41ODM5OFYxNS4wOTc3TDkuNTM5MDYgMTUuMjYxN1YxNkg2LjQ3NDYxWk04LjU4Mzk4IDExLjY3NThIMTAuMzk0NUMxMC45NzI3IDExLjY3NTggMTEuNDA0MyAxMS41MjE1IDExLjY4OTUgMTEuMjEyOUMxMS45Nzg1IDEwLjkwMDQgMTIuMTIzIDEwLjUwNzggMTIuMTIzIDEwLjAzNTJDMTIuMTIzIDkuNTYyNSAxMS45Nzg1IDkuMTY3OTcgMTEuNjg5NSA4Ljg1MTU2QzExLjQwNDMgOC41MzUxNiAxMC45NzI3IDguMzc2OTUgMTAuMzk0NSA4LjM3Njk1SDguNTgzOThWMTEuNjc1OFoiIGZpbGw9IiMyMjIyMjIiLz4KPHJlY3QgeD0iMTUiIHk9IjE0IiB3aWR0aD0iMTEiIGhlaWdodD0iMSIgZmlsbD0iIzIyMjIyMiIvPgo8cmVjdCB4PSI2IiB5PSIxOCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEiIGZpbGw9IiMyMjIyMjIiLz4KPHJlY3QgeD0iNiIgeT0iMjIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxIiBmaWxsPSIjMjIyMjIyIi8+Cjwvc3ZnPgo=';
    /* eslint-enable max-len */

    constructor(
        private suggestionsService: SuggestionsService,
        private cd: ChangeDetectorRef,
        private domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        const headings = [...Array(3).keys()].map((level) => {
            const size = level + 1;
            return {
                label: `Heading ${size}`,
                icon: this.sanitizeUrl(this.headerImages[level]),
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
                icon: this.sanitizeUrl(this.pImage),
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
                icon: this.sanitizeUrl(this.olImage),
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
                icon: this.sanitizeUrl(this.ulImage),
                command: () => {
                    this.onSelection({
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
     * Reset the key manager after we add new elements to the list
     *
     * @memberof SuggestionsComponent
     */
    resetKeyManager() {
        this.list.resetKeyManager();
    }

    /**
     * Handle the active item on menu events
     *
     * @param {MouseEvent} e
     * @memberof SuggestionsComponent
     */
    onMouseEnter(e: MouseEvent) {
        e.preventDefault();
        const index = Number((e.target as HTMLElement).dataset.index);
        this.list.updateActiveItem(index);
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

                                        this.title = 'Select a contentlet';
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
                this.title = 'Select a content type';
                this.items = items;
                this.cd.detectChanges();
                this.resetKeyManager();
            });
    }

    /**
     *
     *
     * @private
     * @param {string} url
     * @return {*}  {SafeUrl}
     * @memberof SuggestionsComponent
     */
    private sanitizeUrl( url: string ): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
