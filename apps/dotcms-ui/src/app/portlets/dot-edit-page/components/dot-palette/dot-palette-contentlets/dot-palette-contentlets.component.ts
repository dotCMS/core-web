import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotContentletEditorService } from '@dotcms/app/view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
// import { CoreWebService } from '@dotcms/dotcms-js';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DotPaginatorESContentService } from '@services/dot-paginator-es-content/dot-paginator-es-content.service';
// import { th } from 'date-fns/locale';
import { LazyLoadEvent } from 'primeng/api';
import { take } from 'rxjs/operators';
// import { DotCMSContentType } from '@dotcms/dotcms-models';
// import { Subject } from 'rxjs';
// import { DotContentletEditorService } from '@components/dot-contentlet-editor/services/dot-contentlet-editor.service';

@Component({
    selector: 'dot-palette-contentlets',
    templateUrl: './dot-palette-contentlets.component.html',
    styleUrls: ['./dot-palette-contentlets.component.scss']
})
export class DotPaletteContentletsComponent implements OnInit {
    // @Input() items: DotCMSContentType[] = [];
    filter: string;
    @Input() contentTypeVariable: string;
    @Output() hide = new EventEmitter();
    items: DotCMSContentlet[];
    hideNoResults = true;

    // private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public paginatorESService: DotPaginatorESContentService,
        // private coreWebService: CoreWebService,
        private dotContentletEditorService: DotContentletEditorService
    ) {}

    ngOnInit() {
        // this.paginatorESService.url = `/api/content/render/false/query/+contentType:${this.contentTypeVariable}`;
        this.paginatorESService.setExtraParams('+contentType', this.contentTypeVariable);
        this.paginatorESService.paginationPerPage = 15;
        this.paginatorESService.deleteExtraParams('+title');

        this.loadData();
    }

    /**
     * Loads data through pagination service
     *
     * @param LazyLoadEvent event
     * @memberof DotAppsConfigurationComponent
     */
    loadData(event?: LazyLoadEvent): void {
        console.log(this.hideNoResults)
        this.paginatorESService
            .getWithOffset((event && event.first) || 0)
            .pipe(take(1))
            .subscribe((data: any[]) => {
                console.log('****data', data, this.paginatorESService.totalRecords);
                this.items = data;
                this.hideNoResults = !!data?.length;
                console.log(this.hideNoResults)

                // const app = [].concat(apps)[0];
                // this.apps.sites = event ? this.apps.sites.concat(app.sites) : app.sites;
                // this.apps.configurationsCount = app.configurationsCount;
                // this.totalRecords = this.paginationService.totalRecords;
                // this.hideLoadDataButton = !this.isThereMoreData(this.apps.sites.length);
            });

        // TODO: remove later
        // this.coreWebService
        //     .requestView({
        //         url: this.paginatorService.url
        //     })
        //     .pipe(pluck('contentlets'))
        //     .subscribe((data) => {
        //         console.log('==== data', data);
        //         this.items = data

        //     });
    }

    paginate(event: LazyLoadEvent) {
        console.log('**event', event);
        this.loadData(event);
        //event.first = Index of the first record
        //event.rows = Number of rows to display in new page
        //event.page = Index of the new page
        //event.pageCount = Total number of pages
    }

    showContentTypesList(): void {
        this.hide.emit();
    }

    /**
     * Notify the dragging element to the service, and finally to the edit iframe.
     *
     * @param DotCMSContentType contentType
     * @memberof DotContentPaletteComponent
     */
    dragStart(contentType: DotCMSContentlet): void {
        this.dotContentletEditorService.setDraggedContentType(contentType);
    }

    filterContentlets(value: string): void {
        console.log('**filter', value);
        value = value.trim();
        if (value.indexOf(' ') > 0) {
            value = `'${value.replace(/'/g, '\\\'')}'`;
        }
        this.paginatorESService.setExtraParams('+title', `${value}*`);
        this.loadData();
    }

    // ngOnDestroy(): void {
    //     this.destroy$.next(true);
    //     this.destroy$.complete();
    // }
}
