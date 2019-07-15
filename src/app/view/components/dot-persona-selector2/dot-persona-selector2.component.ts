// import { Observable, of } from 'rxjs';
import {
    Component,
    ViewEncapsulation,
    ViewChild,
    Output,
    EventEmitter,
    Input,
    OnInit,
    // SimpleChanges,
    // OnChanges,
    // OnDestroy
} from '@angular/core';
// import { Site, SiteService } from 'dotcms-js';
import { PaginatorService } from '@services/paginator';
// import { DotEventsService } from '@services/dot-events/dot-events.service';
import { SearchableDropdownComponent } from '@components/_common/searchable-dropdown/component';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

/**
 * It is dropdown of sites, it handle pagination and global search
 *
 * @export
 * @class DotSiteSelectorComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 * @implements {OnDestroy}
 */
@Component({
    providers: [PaginatorService],
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-persona-selector2',
    styleUrls: ['./dot-persona-selector2.component.scss'],
    templateUrl: 'dot-persona-selector2.component.html'
})
export class DotPersonaSelector2Component implements OnInit {
    @Input()
    pageId: string;
    @Input()
    value: DotPersona;

    @Output()
    selected: EventEmitter<DotPersona> = new EventEmitter();

    // @Input()
    // archive: boolean;
    // @Input()
    // id: string;
    // @Input()
    // live: boolean;
    // @Input()
    // system: boolean;

    // @Output()
    // hide: EventEmitter<any> = new EventEmitter();
    // @Output()
    // show: EventEmitter<any> = new EventEmitter();

    @ViewChild('searchableDropdown')
    searchableDropdown: SearchableDropdownComponent;

    // currentSite: Observable<Site>;
    // sitesCurrentPage: Site[];
    totalRecords: number;
    personas: DotPersona[];
    messagesKey: { [key: string]: string } = {};

    // private refreshSitesSub: Subscription;

    constructor(
        // private siteService: SiteService,
        public paginationService: PaginatorService,
        private dotMessageService: DotMessageService
        // private dotEventsService: DotEventsService
    ) {}

    ngOnInit(): void {
        this.paginationService.url = `v1/page/${this.pageId}/personas`;
        console.log('---value', this.value, this.paginationService.url)

        this.dotMessageService
            .getMessages(['modes.persona.no.persona'])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
                this.value = this.value || { name: this.messagesKey['modes.persona.no.persona'], identifier: '0' };
                this.getPersonasList();
            });
                // this.dotPersonasService
                //     .get()
                //     .pipe(
                //         map((personas: DotPersona[]) =>
                //             this.setOptions(
                //                 this.dotMessageService.get('modes.persona.no.persona'),
                //                 personas
                //             )
                //         )
                //     )
                //     .subscribe((personas: DotPersona[]) => {
                //         this.options = personas;
                //     });
            // });

        // this.paginationService.setExtraParams('archive', this.archive);
        // this.paginationService.setExtraParams('live', this.live);
        // this.paginationService.setExtraParams('system', this.system);

        // this.refreshSitesSub = this.siteService.refreshSites$.subscribe((_site: Site) =>
        //     this.handleSitesRefresh()
        // );



        // ['login-as', 'logout-as'].forEach((event: string) => {
        //     this.dotEventsService.listen(event).subscribe(() => {
        //         this.getSitesList();
        //     });
        // });
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes.id && changes.id.currentValue) {
    //         this.selectCurrentSite(changes.id.currentValue);
    //     }
    // }

    // ngOnDestroy(): void {
    //     this.refreshSitesSub.unsubscribe();
    // }

    /**
     * Manage the sites refresh when a event happen
     * @memberof SiteSelectorComponent
     */
    // handleSitesRefresh(): void {
    //     this.paginationService.getCurrentPage().subscribe((items) => {
    //         this.sitesCurrentPage = [...items];
    //         this.totalRecords = this.paginationService.totalRecords;
    //         this.currentSite = of(this.siteService.currentSite);
    //     });
    // }

    /**
     * Call when the global serach changed
     * @param any filter
     * @memberof SiteSelectorComponent
     */
    handleFilterChange(filter): void {
        this.getPersonasList(filter);
    }

    /**
     * Call when the current page changed
     * @param any event
     * @memberof SiteSelectorComponent
     */
    handlePageChange(event): void {
        this.getPersonasList(event.filter, event.first);
    }

    /**
     * Call to load a new page.
     * @param string [filter='']
     * @param number [page=1]
     * @memberof SiteSelectorComponent
     */
    getPersonasList(filter = '', offset = 0): void {
        console.log('---getPersonasList', filter, offset)
        // Set filter if undefined
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe((items) => {

            this.personas = items.reduce(
                (acc: DotPersona[], currentValue) =>
                    acc.concat(currentValue.persona),
                []
            );

            this.personas = [{ name: this.messagesKey['modes.persona.no.persona'], identifier: '0' }, ...this.personas];


            console.log('---page persona', this.personas);
            // this.sitesCurrentPage = [...items];
            this.totalRecords = this.totalRecords || this.paginationService.totalRecords;
            console.log('---page totalRecords', this.totalRecords);

            // if (!this.currentSite) {
            //     this.setCurrentSiteAsDefault();
            // }
        });
    }

    /**
     * Call when the selected site changed and the change event is emmited
     * @param Site site
     * @memberof SiteSelectorComponent
     */
    personaChange(persona: DotPersona): void {
        this.selected.emit(persona);
    }

    // private getSiteByIdFromCurrentPage(siteId: string): Site {
    //     return (
    //         this.sitesCurrentPage &&
    //         this.sitesCurrentPage.filter((site) => site.identifier === siteId)[0]
    //     );
    // }

    // private selectCurrentSite(siteId: string): void {
    //     const selectedInCurrentPage = this.getSiteByIdFromCurrentPage(siteId);
    //     this.currentSite = selectedInCurrentPage
    //         ? of(selectedInCurrentPage)
    //         : this.siteService.getSiteById(siteId);
    // }

    // private setCurrentSiteAsDefault() {
    //     this.currentSite = of(this.siteService.currentSite);
    // }
}
