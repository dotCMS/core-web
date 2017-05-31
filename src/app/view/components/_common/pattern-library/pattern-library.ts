import {Component, ViewEncapsulation, ViewChild} from '@angular/core';
import {SelectItem, AutoComplete} from 'primeng/primeng';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'pattern-library',
    styles: [require('./pattern-library.scss')],
    templateUrl: 'pattern-library.html'
})

export class PatternLibrary {
    public selectedDummyData = [];
    public selectedCars = [];
    public submitAttempt = false;

    private autocompleteResults: Array<string> = [];
    private cities: SelectItem[];
    private dataTableDummyData: [any];
    private displayDialog = false;
    private model: any = {};
    private buttonActions: [any];

    @ViewChild(AutoComplete) private autoCompleteComponent: AutoComplete;

    constructor() {
        this.cities = [];
        this.cities.push({label: 'Select City', value: null});
        this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
        this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
        this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
        this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
        this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});
        this.buttonActions = [
            {
                label: 'Group Actions',
                model: [
                    {label: 'Update', icon: 'fa-refresh', command: () => {}},
                    {label: 'Delete', icon: 'fa-close', command: () => {}},
                    {label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
                    {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}
                ]
            },
            {
                label: 'Edit Content',
                model: [
                    {label: 'Publish', icon: 'fa-refresh', command: () => {}},
                    {label: 'Unpublish', icon: 'fa-close', command: () => {}},
                    {label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'}
                ]
            }
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
            {vin: 'a1653d4d', brand: 'VW', year: 1998, color: 'White'},
            {vin: 'ddeb9b10', brand: 'Mercedes', year: 1985, color: 'Green'},
            {vin: 'd8ebe413', brand: 'Jaguar', year: 1979, color: 'Silver'},
            {vin: 'aab227b7', brand: 'Audi', year: 1970, color: 'Black'},
            {vin: '631f7412', brand: 'Volvo', year: 1992, color: 'Red'},
            {vin: 'a1653d4d', brand: 'VW 2', year: 1998, color: 'White'},
            {vin: 'ddeb9b10', brand: 'Mercedes 2', year: 1985, color: 'Green'},
            {vin: 'd8ebe413', brand: 'Jaguar 2', year: 1979, color: 'Silver'},
            {vin: 'aab227b7', brand: 'Audi 2', year: 1970, color: 'Black'},
            {vin: '631f7412', brand: 'Volvo 2', year: 1992, color: 'Red'},
            {vin: 'a1653d4d', brand: 'VW 3', year: 1998, color: 'White'},
            {vin: 'ddeb9b10', brand: 'Mercedes 3', year: 1985, color: 'Green'},
            {vin: 'd8ebe413', brand: 'Jaguar 3', year: 1979, color: 'Silver'},
            {vin: 'aab227b7', brand: 'Audi 3', year: 1970, color: 'Black'},
            {vin: '631f7412', brand: 'Volvo 3', year: 1992, color: 'Red'}
        ];
    }

    autocompleteComplete($event): void {
        this.autocompleteResults = [];
        this.autocompleteResults = $event.query.split('');
    }

    autocompleteCompleteDropdownClick($event: {originalEvent: Event, query: string}): void {
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

    actionHeaderLog(): void {
        console.log('Primary command was triggered');
    }
}