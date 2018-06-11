import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { DotTheme } from '../../../shared/models/dot-theme.model';
import { Site } from 'dotcms-js/core/treeable/shared/site.model';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { PaginatorService } from '../../../../../api/services/paginator/paginator.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

/**
 * The DotThemeSelectorComponent is modal that
 * show the themes of the available hosts
 * @export
 * @class DotThemeSelectorComponent
 */
@Component({
    providers: [PaginatorService],
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit {
    themes: DotTheme[];
    @Input() value: DotTheme;
    @Output() selected = new EventEmitter<DotTheme>();
    @Output() close = new EventEmitter<boolean>();
    @ViewChild('searchInput') searchInput: ElementRef;

    current: DotTheme;
    visible = true;

    constructor(public dotMessageService: DotMessageService, public paginatorService: PaginatorService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['editpage.layout.theme.header', 'editpage.layout.theme.search', 'dot.common.apply', 'dot.common.cancel'])
            .subscribe();
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.paginationPerPage = 2;
        this.current = this.value;
        Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
            .debounceTime(500)
            .subscribe((keyboardEvent: Event) => {
                this.filterThemes(keyboardEvent.target['value']);
            });
    }

    /**
     * Load new page of themes.
     * @param {LazyLoadEvent} event
     *
     * @memberof DotThemeSelectorComponent
     */
    paginate(event: LazyLoadEvent) {
        console.log('lazyload');
        this.paginatorService.getWithOffset(event.first).subscribe((items: DotTheme[]) => (this.themes = items));
    }

    /**
     * Handle change in the host to load the corresponding themes.
     * @param {Site} site
     *
     * @memberof DotThemeSelectorComponent
     */
    siteChange(site: Site) {
        // this,
        this.getPagination(site.identifier).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
        this.searchInput.nativeElement.value = null;
    }

    /**
     * Set the selected Theme by the user while the modal is open.
     * @param {DotTheme} theme
     *
     * @memberof DotThemeSelectorComponent
     */
    selectTheme(theme: DotTheme) {
        this.current = theme;
    }

    /**
     * Propagate the seleted theme once the user apply the changes.
     *
     * @memberof DotThemeSelectorComponent
     */
    apply() {
        this.selected.emit(this.current);
        this.hideDialog();
    }

    hideDialog() {
        this.close.emit(false);
    }

    private filterThemes(searchCriteria?: string) {
        this.getPagination(null, searchCriteria).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }

    private getPagination(hostId?: string, searchCriteria?: string): Observable<DotTheme[]> {
        if (hostId) {
            this.paginatorService.setExtraParams('hostId', hostId);
        }
        if (searchCriteria) {
            this.paginatorService.setExtraParams('searchParam', searchCriteria);
        } else {
            this.paginatorService.setExtraParams('searchParam', '');
        }
        return this.paginatorService.get();
    }
}
