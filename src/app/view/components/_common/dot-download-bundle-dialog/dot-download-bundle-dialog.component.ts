import {Component, Inject, OnInit} from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { SelectItem } from 'primeng/api';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import {
    DotPushPublishFilter,
    DotPushPublishFiltersService
} from '@services/dot-push-publish-filters/dot-push-publish-filters.service';
import { Observable, of, Subject } from 'rxjs';
import {catchError, delay, map, take, takeUntil} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotDownloadBundleDialogService } from '@services/dot-download-bundle-dialog/dot-download-bundle-dialog.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';

enum DownloadType {
    UNPUBLISH = 'unpublish',
    PUBLISH = 'publish'
}

@Component({
    selector: 'dot-dot-download-bundle-dialog',
    templateUrl: './dot-download-bundle-dialog.component.html',
    styleUrls: ['./dot-download-bundle-dialog.component.scss']
})
export class DotDownloadBundleDialogComponent implements OnInit, OnDestroy {
    downloadOptions: SelectItem[];
    filterOptions: SelectItem[];
    dialogActions: DotDialogActions;
    form: FormGroup;
    showDialog = false;

    private currentFilterKey: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private _filterOptions: SelectItem[] = null;

    constructor(
        public fb: FormBuilder,
        private dotMessageService: DotMessageService,
        private dotPushPublishFiltersService: DotPushPublishFiltersService,
        private dotDownloadBundleDialogService: DotDownloadBundleDialogService,
        @Inject(DOCUMENT) private document: Document,
    ) {}

    ngOnInit() {
        this.dotDownloadBundleDialogService.showDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((bundleId: string) => {
                this.initForm({
                    bundleId: bundleId
                });
                this.setDialogActions();
                this.lisentForChanges();
                this.showDialog = true;
            });

        this.loadFilters()
            .pipe(take(1))
            .subscribe((options: SelectItem[]) => {
                this.filterOptions = options;
                this.downloadOptions = this.getDonwloadOptions();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close the dialog and reset the form
     * @memberof DotDownloadBundleDialogComponent
     */
    close(): void {
        this.showDialog = false;
    }

    /**
     * show the native download file dialog in the browser
     * @memberof DotDownloadBundleDialogComponent
     */
    downloadFile(): void {
        if (this.form.valid) {
            let location = `/DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/downloadUnpushedBundle/bundleId/${this
                .form.value.bundleId}/operation/${this.form.value.downloadOptionSelected}`;
            if (this.form.controls['filterKey'].value === DownloadType.PUBLISH) {
                location += `/filterKey/${this.form.value.filterKey}`;
            }
            delay(1000);
            fetch(location)
                .then( res => res.blob() )
                .then( blob => {
                    const file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                    this.close();
                    this.document.location.href = location;
                });



            // fetch(location).then(response => {
            //     if (!response.ok) {
            //         throw new Error(response.statusText);
            //     }
            //     debugger;
            //     this.
            //         let blob = new Blob([response]);
            //     let url = window.URL.createObjectURL(blob);
            //     let pwa = window.open(url);
            //     if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            //         alert( 'Please disable your Pop-up blocker and try again.');
            //     }
            //     this.close();
            // });

            // this.coreWebService.requestView({
            //     method: RequestMethod.Get,
            //     url: location
            // }).pipe(take(1)).subscribe(() => this.close());

            // this.document.location.href = location;
        }
    }

    private getDonwloadOptions(): SelectItem[] {
        return [
            {
                label: this.dotMessageService.get('download.bundle.publish'),
                value: DownloadType.PUBLISH
            },
            {
                label: this.dotMessageService.get('download.bundle.unPublish'),
                value: DownloadType.UNPUBLISH
            }
        ];
    }

    private initForm(params?: { [key: string]: any }): void {
        this.form = this.fb.group({
            downloadOptionSelected: [this.downloadOptions[0].value, [Validators.required]],
            filterKey: this.currentFilterKey,
            ...params
        });
    }

    private loadFilters(): Observable<SelectItem[]> {
        return this.dotPushPublishFiltersService.get().pipe(
            map((options: DotPushPublishFilter[]) => {
                this.currentFilterKey = options
                    .filter(({ defaultFilter }: DotPushPublishFilter) => defaultFilter)
                    .map(({ key }: DotPushPublishFilter) => key)
                    .join();

                return options
                    .map((filter: DotPushPublishFilter) => {
                        return {
                            label: filter.title,
                            value: filter.key
                        };
                    })
                    .sort((a: SelectItem, b: SelectItem) => {
                        if (a.label > b.label) {
                            return 1;
                        }
                        if (a.label < b.label) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
            }),
            catchError(() => of([]))
        );
    }

    private setDialogActions(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.downloadFile();
                },
                label: this.dotMessageService.get('download.bundle.download')
            },
            cancel: {
                action: () => {
                    this.close();
                },
                label: this.dotMessageService.get('dot.common.cancel')
            }
        };
    }

    private lisentForChanges(): void {
        this.form
            .get('downloadOptionSelected')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((state: string) => {
                this.handleDropDownState(state);
            });
    }

    private handleDropDownState(state: string): void {
        const filterKey = this.form.controls['filterKey'];
        if (state === DownloadType.UNPUBLISH) {
            this._filterOptions = this.filterOptions;
            this.currentFilterKey = filterKey.value;
            filterKey.disable();
            filterKey.setValue('');
            this.filterOptions = [];
        } else {
            this.filterOptions = this._filterOptions;
            filterKey.enable();
            filterKey.setValue(this.currentFilterKey);
        }
    }
}
