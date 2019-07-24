import {
    Component,
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
 * It is dropdown of personas, it handle pagination and global search
 *
 * @export
 * @class DotPersonaSelectorComponent
 * @implements {OnInit}
 */
@Component({
    providers: [PaginatorService],
    selector: 'dot-persona-selector',
    styleUrls: ['./dot-persona-selector.component.scss'],
    templateUrl: 'dot-persona-selector.component.html'
})
export class DotPersonaSelectorComponent implements OnInit, OnChanges {
    @Input()
    pageId: string;
    @Input()
    value: DotPersona;

    @Output()
    selected: EventEmitter<DotPersona> = new EventEmitter();

    @ViewChild('searchableDropdown')
    searchableDropdown: SearchableDropdownComponent;

    totalRecords: number;
    paginationPerPage = 5;
    personas: DotPersona[];
    messagesKey: { [key: string]: string } = {};
    addAction: (item: DotPersona) => void;

    constructor(
        public paginationService: PaginatorService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isValueChangedAndNotFirstTime(changes)) {
            this.value = {
                name: this.messagesKey['modes.persona.no.persona'],
                identifier: '0'
            };
        }
    }

    ngOnInit(): void {
        this.addAction = () => {
            // TODO Implement + action
        };

        this.paginationService.url = `v1/page/${this.pageId}/personas`;
        this.paginationService.paginationPerPage = this.paginationPerPage;

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
     * Call when the global search changed
     * @param string filter
     * @memberof DotPersonaSelectorComponent
     */
    handleFilterChange(filter: string): void {
        this.getPersonasList(filter);
    }

    /**
     * Call when the current page changed
     * @param any event
     * @memberof DotPersonaSelectorComponent
     */
    handlePageChange(event): void {
        this.getPersonasList(event.filter, event.first);
    }

    /**
     * Call to load a new page.
     * @param string [filter='']
     * @param number [page=1]
     * @memberof DotPersonaSelectorComponent
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
     * Call when the selected persona changed and the change event is emmited
     * @param DotPersona persona
     * @memberof DotPersonaSelectorComponent
     */
    personaChange(persona: DotPersona): void {
        this.selected.emit(persona);
        this.searchableDropdown.toggleOverlayPanel();
    }

    /**
     * Call when the selected persona changed and the change event is emmited
     * @param DotPersona persona
     * @memberof DotPersonaSelectorComponent
     */
    deletePersonalization(_persona: DotPersona): void {
        // TODO: Confirm & call service
        this.searchableDropdown.toggleOverlayPanel();
    }

    private isFirstPageAndNoFilter(filter: string, offset: number): boolean {
        return !filter && offset === 0;
    }

    private isValueChangedAndNotFirstTime(changes: SimpleChanges): boolean {
        return changes.value && !changes.value.currentValue && !changes.value.firstChange;
    }
}
