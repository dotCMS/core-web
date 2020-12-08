import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    OnDestroy
} from '@angular/core';

import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { Site, SiteService } from 'dotcms-js';
import { DataView } from 'primeng/dataview';
import { LazyLoadEvent } from 'primeng/api';

import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { PaginatorService } from '@services/paginator';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotTheme } from '@models/dot-edit-layout-designer';

/**
 * The DotThemeSelectorComponent is modal that
 * show the themes of the available hosts
 * @export
 * @class DotThemeSelectorComponent
 */
@Component({
    selector: 'dot-theme-selector',
    templateUrl: './dot-theme-selector.component.html',
    styleUrls: ['./dot-theme-selector.component.scss']
})
export class DotThemeSelectorComponent implements OnInit, OnDestroy {
    themes: DotTheme[] = [];

    @Input()
    value: DotTheme;

    @Output()
    selected = new EventEmitter<DotTheme>();

    @Output()
    close = new EventEmitter<boolean>();

    @ViewChild('searchInput', { static: true })
    searchInput: ElementRef;

    @ViewChild('dataView', { static: true })
    dataView: DataView;

    current: DotTheme;
    visible = true;
    dialogActions: DotDialogActions;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotMessageService: DotMessageService,
        public paginatorService: PaginatorService,
        private siteService: SiteService,
        public cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.dialogActions = {
            accept: {
                label: this.dotMessageService.get('dot.common.apply'),
                disabled: true,
                action: () => {
                    this.apply();
                }
            },
            cancel: {
                label: this.dotMessageService.get('dot.common.cancel')
            }
        };
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.setExtraParams('hostId', this.siteService.currentSite.identifier);
        this.paginatorService.paginationPerPage = 8;
        this.current = this.value;

        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500), takeUntil(this.destroy$))
            .subscribe((keyboardEvent: Event) => {
                this.filterThemes(keyboardEvent.target['value']);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Load new page of themes.
     * @param LazyLoadEvent event
     *
     * @memberof DotThemeSelectorComponent
     */
    paginate($event: LazyLoadEvent): void {
        this.paginatorService
            .getWithOffset($event.first)
            .pipe(take(1))
            .subscribe((themes: DotTheme[]) => {
                this.themes = themes;
                this.cd.detectChanges();
            });
        this.dataView.first = $event.first;
    }

    /**
     * Handle change in the host to load the corresponding themes.
     * @param Site site
     *
     * @memberof DotThemeSelectorComponent
     */
    siteChange(site: Site): void {
        this.searchInput.nativeElement.value = null;
        this.paginatorService.setExtraParams('hostId', site.identifier);
        this.paginatorService.setExtraParams('searchParam', '');
        this.paginate({ first: 0 });
    }

    /**
     * Set the selected Theme by the user while the modal is open.
     * @param DotTheme theme
     *
     * @memberof DotThemeSelectorComponent
     */
    selectTheme(theme: DotTheme): void {
        this.current = theme;
        this.dialogActions = {
            ...this.dialogActions,
            accept: {
                ...this.dialogActions.accept,
                disabled: this.value.inode === this.current.inode
            }
        };
    }

    /**
     * Propagate the selected theme once the user apply the changes.
     *
     * @memberof DotThemeSelectorComponent
     */
    apply(): void {
        this.selected.emit(this.current);
    }

    /**
     * Propagate the close event wen the modal closes.
     *
     * @memberof DotThemeSelectorComponent
     */
    hideDialog(): void {
        this.close.emit(false);
    }

    private filterThemes(searchCriteria?: string): void {
        this.paginatorService.setExtraParams('searchParam', searchCriteria);
        this.paginate({ first: 0 });
    }
}
