import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { LoggerService } from 'dotcms-js/dotcms-js';
import { SelectItem, AutoComplete } from 'primeng/primeng';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-pattern-library',
    styleUrls: ['./pattern-library.component.scss'],
    templateUrl: 'pattern-library.component.html'
})
export class PatternLibraryComponent implements OnInit {
    selectedDummyData = [];
    submitAttempt = false;
    actionHeaderLog;
    splitButtonItems = [];

    autocompleteResults: Array<string> = [];
    cities: SelectItem[];
    dataTableDummyData: [any];
    displayDialog = false;
    model: any = {};
    buttonActions: [any];
    actionButtonItems: [any];
    contentTypeColumns: any;

    searchableForm: FormGroup;
    totalRecords: number;
    sitesCurrentPage: any[] = [];
    sites: any[] = [];

    private readonly ROWS = 10;

    @ViewChild(AutoComplete) private autoCompleteComponent: AutoComplete;

    constructor(public loggerService: LoggerService, private fb: FormBuilder) {
        this.cities = [];
        this.cities.push({ label: 'Select City', value: null });
        this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
        this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
        this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
        this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
        this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });
        this.buttonActions = [
            {
                label: 'Group Actions',
                model: [
                    { label: 'Action One', icon: 'fa-refresh', command: () => {} },
                    { label: 'Action Two', icon: 'fa-close', command: () => {} }
                ]
            },
            {
                label: 'More Actions',
                model: [
                    { label: 'Action Three', icon: 'fa-refresh', command: () => {} },
                    { label: 'Action Four', icon: 'fa-close', command: () => {} }
                ]
            }
        ];
        this.actionButtonItems = [
            {
                command: () => {
                    this.loggerService.info('action update');
                },
                icon: 'fa-refresh',
                label: 'Update'
            },
            {
                command: () => {
                    this.loggerService.info('action delete');
                },
                icon: 'fa-close',
                label: 'Delete'
            },
            {
                icon: 'fa-link',
                label: 'Angular.io',
                url: 'http://angular.io'
            },
            {
                icon: 'fa-paint-brush',
                label: 'Theming',
                routerLink: ['/theming']
            }
        ];

        this.contentTypeColumns = [
            { fieldName: 'name', header: 'Name', width: '20%', sortable: true },
            { fieldName: 'variable', header: 'Variable', width: '20%' },
            { fieldName: 'description', header: 'Description', width: '30%' },
            { fieldName: 'nEntries', header: 'Entries', width: '10%' },
            { fieldName: 'modDate', header: 'Last Edit Date', width: '20%', format: 'date', sortable: true }
        ];

        this.actionHeaderLog = () => {
            this.loggerService.info('Primary command was triggered');
        };

        this.splitButtonItems = [
            {
                label: 'Update',
                icon: 'fa-refresh',
                command: () => {
                    console.log('Hello World');
                }
            },
            {
                label: 'Delete',
                icon: 'fa-close',
                command: () => {
                    console.log('Hello World');
                }
            },
            { label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io' },
            { label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming'] }
        ];
    }

    ngOnInit(): any {
        this.model = {
            checkboxValues: ['Disabled'],
            dropdownNormal: '',
            dropdownWithFilter: '',
            inputTextFloatingLabel: '',
            inputTextRegularLabel: '',
            radioBoxValues: ['Disabled'],
            textareaFloatingLabel: '',
            textareaRegularLabel: ''
        };

        // Fake data for datatable
        this.dataTableDummyData = [
            { vin: 'a1653d4d', brand: 'VW', year: 1998, color: 'White' },
            { vin: 'ddeb9b10', brand: 'Mercedes', year: 1985, color: 'Green' },
            { vin: 'd8ebe413', brand: 'Jaguar', year: 1979, color: 'Silver' },
            { vin: 'aab227b7', brand: 'Audi', year: 1970, color: 'Black' },
            { vin: '631f7412', brand: 'Volvo', year: 1992, color: 'Red' },
            { vin: 'a1653d4d', brand: 'VW 2', year: 1998, color: 'White' },
            { vin: 'ddeb9b10', brand: 'Mercedes 2', year: 1985, color: 'Green' },
            { vin: 'd8ebe413', brand: 'Jaguar 2', year: 1979, color: 'Silver' },
            { vin: 'aab227b7', brand: 'Audi 2', year: 1970, color: 'Black' },
            { vin: '631f7412', brand: 'Volvo 2', year: 1992, color: 'Red' },
            { vin: 'a1653d4d', brand: 'VW 3', year: 1998, color: 'White' },
            { vin: 'ddeb9b10', brand: 'Mercedes 3', year: 1985, color: 'Green' },
            { vin: 'd8ebe413', brand: 'Jaguar 3', year: 1979, color: 'Silver' },
            { vin: 'aab227b7', brand: 'Audi 3', year: 1970, color: 'Black' },
            { vin: '631f7412', brand: 'Volvo 3', year: 1992, color: 'Red' }
        ];

        this.initSites();
    }

    actionButtonLog(): void {
        this.loggerService.info('Primary action triggered');
    }

    autocompleteComplete($event): void {
        this.autocompleteResults = [];
        this.autocompleteResults = $event.query.split('');
    }

    autocompleteCompleteDropdownClick($event: { originalEvent: Event; query: string }): void {
        $event.originalEvent.preventDefault();
        $event.originalEvent.stopPropagation();
        this.autocompleteResults = [];
        if ($event.query === '') {
            this.autocompleteResults = ['Please', 'type', 'something'];
        } else {
            this.autocompleteResults = $event.query.split('');
        }
        this.autoCompleteComponent.show();
    }

    showDialog(): void {
        this.displayDialog = true;
    }

    handleFilterChange(filter): void {
        this.sitesCurrentPage = this.sites.filter((site) => site.name.indexOf(filter) !== -1);
        this.totalRecords = this.sitesCurrentPage.length;
        this.sitesCurrentPage = this.sitesCurrentPage.slice(0, this.ROWS);
    }

    handlePageChange(event): void {
        this.sitesCurrentPage = this.sites.slice(event.first, event.first + this.ROWS);
    }

    private initSites(): void {
        for (let k = 0; k < 50; k++) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            this.sites[k] = {
                id: k,
                name: text
            };
        }

        this.sitesCurrentPage = this.sites.slice(0, this.ROWS);
        this.totalRecords = this.sites.length;
        this.searchableForm = this.fb.group({
            currentSite: '',
            fakeCurrentSite: this.sites[0]
        });
    }
}
