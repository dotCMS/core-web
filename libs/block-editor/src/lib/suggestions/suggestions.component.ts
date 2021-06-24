import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { map, take } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

import { SuggestionsService } from '../services/suggestions.service';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

@Component({
    selector: 'dotcms-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
    @Input() command: ({ payload, type }: { payload?: DotCMSContentlet; type: string }) => void;
    items: MenuItem[] = [];

    constructor(private suggestionsService: SuggestionsService, private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.suggestionsService
            .getContentTypes()
            .pipe(
                map((items) => {
                    return items.map((item) => {
                        return {
                            label: item['name'],
                            icon: 'pi pi-fw pi-plus',
                            command: () => {
                                this.suggestionsService
                                    .getContentlets(item['variable'])
                                    .pipe(take(1))
                                    .subscribe((contentlets) => {
                                        this.items = contentlets.map((contentlet) => {
                                            return {
                                                label: contentlet['title'],
                                                icon: 'pi pi-fw pi-plus',
                                                command: () => {
                                                    this.command({
                                                        payload: contentlet,
                                                        type: 'dotContent'
                                                    });
                                                }
                                            };
                                        });

                                        this.cd.detectChanges();
                                    });
                            }
                        };
                    });
                }),
                take(1)
            )
            .subscribe((items) => {
                this.items = [
                    ...[
                        {
                            label: 'Heading 1',
                            icon: 'pi pi-circle-on',
                            command: () => {
                                this.command({
                                    type: 'heading'
                                });
                            }
                        }
                    ],
                    ...items
                ];
            });
    }
}
