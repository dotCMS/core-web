import {
    Component,
    ViewEncapsulation,
    ViewChild,
    Output,
    EventEmitter,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { PaginatorService } from '@services/paginator';
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
 */
@Component({
    providers: [PaginatorService],
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-persona-selector2',
    styleUrls: ['./dot-persona-selector2.component.scss'],
    templateUrl: 'dot-persona-selector2.component.html'
})
export class DotPersonaSelector2Component implements OnInit, OnChanges {
    @Input()
    pageId: string;
    @Input()
    value: DotPersona;

    @Output()
    selected: EventEmitter<DotPersona> = new EventEmitter();
    @Output()
    removePersonalization: EventEmitter<DotPersona> = new EventEmitter();

    @ViewChild('searchableDropdown')
    searchableDropdown: SearchableDropdownComponent;

    totalRecords: number;
    personas: DotPersona[];
    messagesKey: { [key: string]: string } = {};
    addAction: (action: any) => void;

    constructor(
        public paginationService: PaginatorService,
        private dotMessageService: DotMessageService
    ) {}

    // tslint:disable-next-line:cyclomatic-complexity
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value && !changes.value.currentValue && !changes.value.firstChange) {
            this.value = {
                name: this.messagesKey['modes.persona.no.persona'],
                identifier: '0'
            };
        }
    }

    ngOnInit(): void {
        this.addAction = () => {
            console.log('--- Clicked + Action');
        };

        this.paginationService.url = `v1/page/${this.pageId}/personas`;

        this.dotMessageService
            .getMessages(['modes.persona.no.persona', 'modes.persona.selector.title'])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
                this.value = this.value || {
                    name: this.messagesKey['modes.persona.no.persona'],
                    identifier: '0'
                };
                this.getPersonasList();
            });
    }

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

        // Set filter if undefined
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe((items) => {

            this.personas = [];
            if (this.isFirstPageAndNoFilter(filter, offset)) {
                this.personas = [
                    { name: this.messagesKey['modes.persona.no.persona'], identifier: '0' }
                ];
            }
            this.personas = [...this.personas, ...items];
            this.totalRecords = this.totalRecords || this.paginationService.totalRecords;
        });
    }

    /**
     * Call when the selected site changed and the change event is emmited
     * @param Site site
     * @memberof SiteSelectorComponent
     */
    personaChange(persona: DotPersona): void {
        this.selected.emit(persona);
        this.searchableDropdown.toogleOverlayPanel();
    }

    /**
     * Call when the selected site changed and the change event is emmited
     * @param Site site
     * @memberof SiteSelectorComponent
     */
    deletePersonalization(persona: DotPersona): void {
        console.log('--deletePersonalization', persona)
        // TODO: Confirm & call service
        this.searchableDropdown.toogleOverlayPanel();
    }

    private isFirstPageAndNoFilter(filter: string, offset: number): boolean {
        return !filter && offset === 0;
    }
}
