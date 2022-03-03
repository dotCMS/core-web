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
import { SafeUrl } from '@angular/platform-browser';
import { suggestionOptions } from '@dotcms/block-editor';

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

    constructor(private suggestionsService: SuggestionsService, private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.items?.length === 0) {
            // assign the default suggestions options.
            this.items = suggestionOptions;
            this.items.forEach((item) => {
                item.command = (data) => {
                    console.log(data);
                    if (item.id.includes('heading')) {
                        this.onSelection({
                            type: { name: 'heading', level: parseInt(item.id.slice(-1)) }
                        });
                    } else {
                        this.onSelection({ type: { name: item.id } });
                    }
                };
            });

            this.items = [
                {
                    label: 'Contentlets',
                    icon: 'receipt',
                    command: () => {
                        this.initContentletSelection();
                    }
                },
                ...this.items
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
        console.log('mouse enter');
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
        console.log('onMouseDown');
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
}
