import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
// import { DotCMSContentType } from '@dotcms/dotcms-models';
// import { Subject } from 'rxjs';
// import { DotContentletEditorService } from '@components/dot-contentlet-editor/services/dot-contentlet-editor.service';

@Component({
    selector: 'dot-palette-input-filter',
    templateUrl: './dot-palette-input-filter.component.html',
    styleUrls: ['./dot-palette-input-filter.component.scss']
})
export class DotPaletteInputFilterComponent implements OnInit {
    // @Input() items: DotCMSContentType[] = [];
    value: string;
    @Input() goBackBtn: boolean;
    @Output() goBack: EventEmitter<boolean> = new EventEmitter();
    @Output() filter: EventEmitter<string> = new EventEmitter();

    items: DotCMSContentlet[];

    // private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
    ) {}

    ngOnInit() {
        // this.paginatorService.url = `/api/content/render/false/query/+contentType:${this.contentTypeVariable}`;
        // this.loadData();
    }

    // /**
    //  * Loads data through pagination service
    //  *
    //  * @param LazyLoadEvent event
    //  * @memberof DotAppsConfigurationComponent
    //  */
    // loadData(event?: LazyLoadEvent): void {
    //     /*
    //     this.paginatorService
    //         .getWithOffset((event && event.first) || 0)
    //         .pipe(take(1))
    //         .subscribe((data: any[]) => {
    //             console.log('****data', data)
    //             // const app = [].concat(apps)[0];
    //             // this.apps.sites = event ? this.apps.sites.concat(app.sites) : app.sites;
    //             // this.apps.configurationsCount = app.configurationsCount;
    //             // this.totalRecords = this.paginationService.totalRecords;
    //             // this.hideLoadDataButton = !this.isThereMoreData(this.apps.sites.length);
    //         });
    //         */

    //     // TODO: remove later
    //     this.coreWebService
    //         .requestView({
    //             url: this.paginatorService.url
    //         })
    //         .pipe(pluck('contentlets'))
    //         .subscribe((data) => {
    //             console.log('==== data', data);
    //             this.items = data

    //         });
    // }

    // showContentTypesList(): void {
    //     this.hide.emit();
    // }

    // /**
    //  * Notify the dragging element to the service, and finally to the edit iframe.
    //  *
    //  * @param DotCMSContentType contentType
    //  * @memberof DotContentPaletteComponent
    //  */
    // dragStart(contentType: DotCMSContentlet): void {
    //     this.dotContentletEditorService.setDraggedContentType(contentType);
    // }

    // ngOnDestroy(): void {
    //     this.destroy$.next(true);
    //     this.destroy$.complete();
    // }
}
