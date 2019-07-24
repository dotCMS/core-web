import { debounceTime } from 'rxjs/operators';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
    forwardRef,
    SimpleChanges,
    OnChanges,
    OnInit,
    SimpleChange,
    TemplateRef,
    ContentChildren,
    QueryList,
    AfterContentInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotMessageService } from '@services/dot-messages-service';
import { fromEvent } from 'rxjs';
import { OverlayPanel, PrimeTemplate } from 'primeng/primeng';
import * as _ from 'lodash';

/**
 * Dropdown with pagination and global search
 * @export
 * @class SearchableDropdownComponent
 * @implements {ControlValueAccessor}
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchableDropdownComponent)
        }
    ],
    selector: 'dot-searchable-dropdown',
    styleUrls: ['./searchable-dropdown.component.scss'],
    templateUrl: './searchable-dropdown.component.html'
})
export class SearchableDropdownComponent
    implements ControlValueAccessor, OnChanges, OnInit, AfterContentInit {
    @Input()
    data: any[];

    @Input() action: (action: any) => void;

    @Input()
    labelPropertyName: string | string[];

    @Input()
    valuePropertyName: string;

    @Input()
    pageLinkSize = 3;

    @Input()
    rows: number;

    @Input()
    cssClass: string;

    @Input()
    totalRecords: number;

    @Input()
    placeholder = '';

    @Input()
    persistentPlaceholder: boolean;

    @Input()
    width = '300';

    @Input()
    multiple: boolean;

    @Output()
    change: EventEmitter<any> = new EventEmitter();

    @Output()
    filterChange: EventEmitter<string> = new EventEmitter();

    @Output()
    hide: EventEmitter<any> = new EventEmitter();

    @Output()
    pageChange: EventEmitter<PaginationEvent> = new EventEmitter();

    @Output()
    show: EventEmitter<any> = new EventEmitter();

    @ViewChild('searchInput')
    searchInput: ElementRef;

    @ViewChild('searchPanel')
    searchPanelRef: OverlayPanel;

    @ViewChild('button')
    button: ElementRef;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    externalSelectTemplate: TemplateRef<any>;
    externalItemListTemplate: TemplateRef<any>;

    options: any[];

    value: any;
    valueString = '';

    label: string;
    disabled = false;
    i18nMessages: {
        [key: string]: string;
    } = {};

    constructor(private dotMessageService: DotMessageService) {}

    propagateChange = (_: any) => {};

    ngOnChanges(change: SimpleChanges): void {
        if (this.usePlaceholder(change.placeholder) || change.persistentPlaceholder) {
            this.setLabel();
        }
        this.setOptions(change);
    }

    ngOnInit(): void {
        this.dotMessageService.getMessages(['search']).subscribe((res) => {
            this.i18nMessages = res;
        });
        fromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500))
            .subscribe((keyboardEvent: Event) => {
                this.filterChange.emit(keyboardEvent.target['value']);
            });
    }

    ngAfterContentInit() {
        this.templates.forEach((item: PrimeTemplate) => {
            if (item.getType() === 'listItem') {
                this.externalItemListTemplate = item.template;
            } else if (item.getType() === 'select') {
                this.externalSelectTemplate = item.template;
            }
        });
    }

    hideDialogHandler(): void {
        if (this.searchInput.nativeElement.value.length) {
            this.searchInput.nativeElement.value = '';
            this.paginate({});
        }
        this.hide.emit();
    }

    /**
     * Call when the current page is changed
     * @param any event
     * @memberof SearchableDropdownComponent
     */
    paginate(event): void {
        const paginationEvent = Object.assign({}, event);
        paginationEvent.filter = this.searchInput.nativeElement.value;
        this.pageChange.emit(paginationEvent);
    }

    /**
     * Write a new value to the element
     * @param * value
     * @memberof SearchableDropdownComponent
     */
    writeValue(value: any): void {
        this.setValue(value);
    }

    /**
     * Set the function to be called when the control receives a change event.
     * @param any fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Get labels from container, if labelPropertyName is an array then loop through it and returns
     * a string containing the labels joining by "-" if is not just returns a label
     * @param DotContainer container
     * @returns string
     * @memberof SearchableDropdownComponent
     */
    getItemLabel(dropDownItem: any): string {
        let resultProps;

        if (Array.isArray(this.labelPropertyName)) {
            resultProps = this.labelPropertyName.map((item) => {
                if (item.indexOf('.') > -1) {
                    let propertyName;
                    item.split('.').forEach((nested) => {
                        propertyName = propertyName ? propertyName[nested] : dropDownItem[nested];
                    });

                    return propertyName;
                }

                return dropDownItem[item];
            });

            return resultProps.join(' - ');
        } else {
            return dropDownItem[this.labelPropertyName];
        }
    }

    /**
     * Call when a option is clicked, if this option is not the same of the current value then
     * the change events is emitted. If multiple is true allow to emit the same value.
     * @param any item
     * @memberof SearchableDropdownComponent
     */
    handleClick(item: any): void {
        if (this.value !== item || this.multiple) {
            this.setValue(item);
            this.propagateChange(this.getValueToPropagate());
            this.change.emit(Object.assign({}, this.value));
        }

        this.toggleOverlayPanel();
    }

    /**
     * Shows or hide the list of options.
     * @param MouseEvent event
     * @memberof SearchableDropdownComponent
     */
    toggleOverlayPanel($event?: MouseEvent): void {
        $event ? this.searchPanelRef.toggle($event) : this.searchPanelRef.hide();
    }

    /**
     * Disabled the component, for more information see:
     * {@link https://angular.io/api/forms/ControlValueAccessor#setdisabledstate}
     *
     * @param {boolean} isDisabled if it is true the component is disabled
     * @memberof SearchableDropdownComponent
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     *Return the component's label
     *
     * @returns {string} compoenent's label
     * @memberof SearchableDropdownComponent
     */
    setLabel(): void {
        this.valueString = this.value
            ? this.value[this.getValueLabelPropertyName()]
            : this.placeholder;
        this.label = this.persistentPlaceholder ? this.placeholder : this.valueString;
    }

    private setOptions(change: SimpleChanges): void {
        if (change.data && change.data.currentValue) {
            this.options = _.cloneDeep(change.data.currentValue).map((item) => {
                item.label = this.getItemLabel(item);
                return item;
            });
        }
    }

    private usePlaceholder(placeholderChange: SimpleChange): boolean {
        return placeholderChange && placeholderChange.currentValue && !this.value;
    }

    private setValue(newValue: any): void {
        this.value = newValue;

        this.setLabel();
    }

    private getValueLabelPropertyName(): string {
        return Array.isArray(this.labelPropertyName)
            ? this.labelPropertyName[0]
            : this.labelPropertyName;
    }

    private getValueToPropagate(): string {
        return !this.valuePropertyName ? this.value : this.value[this.valuePropertyName];
    }
}

export interface PaginationEvent {
    first: number; // Index of the first record
    filter: string;
    page: number; // Index of the new page
    pageCount: number; // Total number of pages
    rows: number; // Number of rows to display in new page
}
