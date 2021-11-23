import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { DotContentletEditorService } from '@dotcms/app/view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
import {
    DotPaginatorESContentService,
    queryEsParams
} from '@services/dot-paginator-es-content/dot-paginator-es-content.service';
import { PaginatorService } from '@services/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { take } from 'rxjs/operators';
import { DotPaletteInputFilterComponent } from '../dot-palette-input-filter/dot-palette-input-filter.component';

@Component({
    selector: 'dot-palette-contentlets',
    templateUrl: './dot-palette-contentlets.component.html',
    styleUrls: ['./dot-palette-contentlets.component.scss']
})
export class DotPaletteContentletsComponent implements OnInit, OnChanges {
    @ViewChild('filterInput', { static: true })
    filterInput: DotPaletteInputFilterComponent;

    @Input() contentTypeVariable: string;
    @Input() languageId: string;
    @Output() hide = new EventEmitter();
    items: DotCMSContentlet[] | DotCMSContentType[] = [];
    isFormContentType: boolean;
    hideNoResults = true;

    private _ESParams: queryEsParams;
    private _filter: string;

    constructor(
        public paginatorESService: DotPaginatorESContentService,
        public paginationService: PaginatorService,
        private dotContentletEditorService: DotContentletEditorService
    ) {}

    ngOnInit(): void {
        this._ESParams = {
            itemsPerPage: 15,
            lang: this.languageId || '1',
            query: ''
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.contentTypeVariable?.currentValue) {
            this.isFormContentType = changes?.contentTypeVariable?.currentValue === 'forms';

            if (this.isFormContentType) {
                this.paginationService.url = `v1/contenttype`;
                this.paginationService.paginationPerPage = 15;
                this.paginationService.sortField = 'modDate';
                this.paginationService.setExtraParams('type', 'Form');
                this.paginationService.sortOrder = 1;
            }

            this.loadData();
        }
    }

    /**
     * Loads data through pagination service
     *
     * @param LazyLoadEvent [event]
     * @memberof DotPaletteContentletsComponent
     */
    loadData(event?: LazyLoadEvent): void {
        if (this.isFormContentType) {
            this.paginationService.setExtraParams(
                'filter',
                this.filterInput.searchInput.nativeElement.value
            );
            this.paginationService
                .getWithOffset((event && event.first) || 0)
                .pipe(take(1))
                .subscribe((data: DotCMSContentType[] | DotCMSContentlet[]) => {
                    data.forEach((item) => (item.contentType = item.variable = 'FORM'));
                    this.items = data;
                    this.hideNoResults = !!data?.length;
                });
        } else {
            this.paginatorESService
                .get({
                    ...this._ESParams,
                    lang: this.languageId || '1',
                    filter: this._filter || '',
                    offset: (event && event.first) || 0,
                    query: `+contentType: ${this.contentTypeVariable}`
                })
                .pipe(take(1))
                .subscribe((data: DotCMSContentType[] | DotCMSContentlet[]) => {
                    this.items = data;
                    this.hideNoResults = !!data?.length;
                });
        }
    }

    /**
     * Calls loads data function with a specific page to load
     *
     * @param LazyLoadEvent event
     * @memberof DotPaletteContentletsComponent
     */
    paginate(event: LazyLoadEvent): void {
        this.loadData(event);
    }

    /**
     * Emits notification to show content type's component and clears
     * component's local variables
     *
     * @param LazyLoadEvent event
     * @memberof DotPaletteContentletsComponent
     */
    showContentTypesList(): void {
        this.items = null;
        this._filter = '';
        this.filterInput.searchInput.nativeElement.value = '';
        this.hide.emit();
    }

    /**
     * Set the contentlet being dragged from the Content palette to dotContentletEditorService
     *
     * @param DotCMSContentType contentType
     * @memberof DotPaletteContentletsComponent
     */
    dragStart(contentType: DotCMSContentlet): void {
        this.dotContentletEditorService.setDraggedContentType(contentType);
    }

    /**
     * Does the string formatting in order to do a filtering of the Contentlets,
     * finally call the loadData() to request the data
     *
     * @param DotCMSContentType contentType
     * @memberof DotPaletteContentletsComponent
     */
    filterContentlets(value: string): void {
        value = value.trim();

        if (this.isFormContentType) {
            this.paginationService.searchParam = 'variable';
            this.paginationService.filter = value;
        } else {
            this._filter = value;
        }

        this.loadData();
    }
}
