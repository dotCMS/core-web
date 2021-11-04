import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { DotContentletEditorService } from '@dotcms/app/view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DotPaginatorESContentService } from '@services/dot-paginator-es-content/dot-paginator-es-content.service';
import { LazyLoadEvent } from 'primeng/api';
import { take } from 'rxjs/operators';
import { DotPaletteInputFilterComponent } from '../dot-palette-input-filter/dot-palette-input-filter.component';

@Component({
    selector: 'dot-palette-contentlets',
    templateUrl: './dot-palette-contentlets.component.html',
    styleUrls: ['./dot-palette-contentlets.component.scss']
})
export class DotPaletteContentletsComponent implements OnChanges {
    @ViewChild('filterInput', { static: true })
    filterInput: DotPaletteInputFilterComponent;

    @Input() contentTypeVariable: string;
    @Output() hide = new EventEmitter();
    items: DotCMSContentlet[];
    hideNoResults = true;

    constructor(
        public paginatorESService: DotPaginatorESContentService,
        private dotContentletEditorService: DotContentletEditorService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.contentTypeVariable?.currentValue) {
            this.paginatorESService.setExtraParams('+contentType', this.contentTypeVariable);
            this.paginatorESService.deleteExtraParams('+title');
            this.paginatorESService.paginationPerPage = 15;

            this.loadData();
        }
    }

    /**
     * Loads data through pagination service
     *
     * @param LazyLoadEvent event
     * @memberof DotAppsConfigurationComponent
     */
    loadData(event?: LazyLoadEvent): void {
        this.paginatorESService
            .getWithOffset((event && event.first) || 0)
            .pipe(take(1))
            .subscribe((data: any[]) => {
                this.items = data;
                this.hideNoResults = !!data?.length;
            });

    }

    paginate(event: LazyLoadEvent) {
        this.loadData(event);
    }

    showContentTypesList(): void {
        this.items = null;
        this.filterInput.searchInput.nativeElement.value = '';
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
        value = value.trim();
        if (value.indexOf(' ') > 0) {
            value = `'${value.replace(/'/g, "\\'")}'`;
        }
        this.paginatorESService.setExtraParams('+title', `${value}*`);
        this.loadData();
    }

}
