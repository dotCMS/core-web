import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
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
    pageSize = 8;
    themes: DotTheme[];
    @Input() value: any;
    @Output() selected = new EventEmitter<DotTheme>();
    @ViewChild('searchInput') searchInput: ElementRef;

    current: DotTheme;
    initialValue: DotTheme;
    visible: boolean;

    constructor(
        private dotThemesService: DotThemesService,
        public dotMessageService: DotMessageService,
        public paginatorService: PaginatorService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['editpage.layout.theme.header', 'editpage.layout.theme.search', 'dot.common.apply', 'dot.common.cancel'])
            .subscribe();
        this.setCurrentTheme();
        this.paginatorService.addExtraParams('per_page', this.pageSize);
        Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
            .debounceTime(500)
            .subscribe((keyboardEvent: Event) => {
                alert(keyboardEvent.target['value']);
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
        this.paginatorService.getWithOffset(event.first).subscribe((items: DotTheme[]) => (this.themes = items));
    }

    /**
     * Handle change in the host to load the corresponding themes.
     * @param {Site} site
     *
     * @memberof DotThemeSelectorComponent
     */
    siteChange(site: Site) {
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
        this.initialValue = this.current;
        this.toogleDialog();
    }

    /**
     * Toogle the visibility the modal and set the initial state when visible.
     *
     * @memberof DotThemeSelectorComponent
     */
    toogleDialog() {
        this.visible = !this.visible;
        if (this.visible) {
            this.setInitialState();
        }
    }

    private getPagination(hostId?: string, searchCriteria?: string): Observable<DotTheme[]> {
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.removeExtraParams('searchParam');

        if (hostId) {
            this.paginatorService.removeExtraParams('hostId');
            this.paginatorService.addExtraParams('hostId', hostId);
        }
        if (searchCriteria) {
            this.paginatorService.addExtraParams('searchParam', searchCriteria);
        }
        return this.paginatorService.getCurrentPage();
    }

    private filterThemes(searchCriteria?: string) {
        this.getPagination(null, searchCriteria).subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
    }

    private setCurrentTheme() {
        if (this.initialValue) {
            this.current = this.initialValue;
        } else {
            this.dotThemesService.get(this.value).subscribe((response: DotTheme[]) => {
                this.initialValue = response[0];
                this.current = response[0];
            });
        }
    }

    private setInitialState() {
        this.setCurrentTheme();
        this.paginatorService.removeExtraParams('hostId');
        this.getPagination().subscribe((response: DotTheme[]) => {
            this.themes = response;
        });
        this.searchInput.nativeElement.value = null;
    }
}
