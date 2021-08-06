import { debounceTime } from 'rxjs/operators';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    forwardRef,
    SimpleChanges,
    OnChanges,
    OnInit,
    SimpleChange,
    TemplateRef,
    ContentChildren,
    QueryList,
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';
import * as _ from 'lodash';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DataView } from 'primeng/dataview';
import { PrimeTemplate } from 'primeng/api';

/**
 * Dropdown with pagination and global search
 * @export
 * @class SearchableDropdownComponent
 * @implements {ControlValueAccessor}
 */
@Component({
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
    implements ControlValueAccessor, OnChanges, OnInit, AfterContentInit, AfterViewInit {
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

    /**
     * Sets the width of the searchable-dropdown button
     *
     * The CSS unit is **required**.
     * @memberof SearchableDropdownComponent
     */
    @Input()
    width = '300px';

    /**
     * Sets the width of the searchable-dropdown overlay
     *
     * The CSS unit is **required**.
     * @memberof SearchableDropdownComponent
     */
    @Input()
    overlayWidth = '300px';

    @Input()
    multiple: boolean;

    @Input()
    disabled = false;

    @Input()
    externalItemListTemplate: TemplateRef<any>;

    @Input()
    externalFilterTemplate: TemplateRef<any>;

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

    @ViewChild('searchInput', { static: false })
    searchInput: ElementRef;

    @ViewChild('searchPanel', { static: true })
    searchPanelRef: OverlayPanel;

    @ViewChild('dataView', { static: true })
    dataViewRef: DataView;

    @ViewChild('button')
    button: ElementRef;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    valueString = '';
    value: any;
    overlayPanelMinHeight: string;
    options: any[];
    label: string;
    externalSelectTemplate: TemplateRef<any>;

    keyMap: string[] = [
        'Shift',
        'Alt',
        'Control',
        'Meta',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
    ];

    constructor(private cd: ChangeDetectorRef) {}

    propagateChange = (_: any) => {};

    ngOnChanges(changes: SimpleChanges): void {
        if (this.usePlaceholder(changes.placeholder) || changes.persistentPlaceholder) {
            this.setLabel();
        }
        this.setOptions(changes);
        this.totalRecords = this.totalRecords || this.data?.length;

        // If new data comes from the first time and needs to show first page on pagination
        if (changes.data && changes.totalRecords && !changes.totalRecords.firstChange) {
            this.dataViewRef.paginate({
                first: 0,
                rows: this.rows
            });
        }
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        if (this.searchInput) {
            fromEvent(this.searchInput.nativeElement, 'keyup')
                .pipe(debounceTime(500))
                .subscribe((keyboardEvent: KeyboardEvent) => {
                    if (!this.isModifierKey(keyboardEvent.key)) {
                        this.filterChange.emit(keyboardEvent.target['value']);
                    }
                });
        }
    }

    ngAfterContentInit() {
        this.totalRecords = this.totalRecords || this.data?.length;
        this.templates.forEach((item: PrimeTemplate) => {
            if (item.getType() === 'listItem') {
                this.externalItemListTemplate = item.template;
            } else if (item.getType() === 'select') {
                this.externalSelectTemplate = item.template;
            }
        });
    }

    /**
     * Emits hide event and clears any value on filter's input
     *
     * @memberof SearchableDropdownComponent
     */
    hideOverlayHandler(): void {
        if (this.searchInput?.nativeElement.value.length) {
            this.searchInput.nativeElement.value = '';
            this.paginate(null);
        }
        this.hide.emit();
    }

    /**
     * Emits show event, sets height of overlay panel based on content
     * and add css class if paginator present
     *
     * @memberof SearchableDropdownComponent
     */
    showOverlayHandler(): void {
        const cssClass =
            this.totalRecords > this.rows
                ? ' searchable-dropdown paginator'
                : ' searchable-dropdown';
        if (typeof this.cssClass === 'undefined') {
            this.cssClass = cssClass;
        } else {
            this.cssClass += cssClass;
        }
        setTimeout(() => {
            if (!this.overlayPanelMinHeight) {
                this.overlayPanelMinHeight = this.searchPanelRef.container
                    .getBoundingClientRect()
                    .height.toString();
            }
        }, 0);
        this.show.emit();
        this.dataViewRef.paginate({
            first: 0,
            rows: this.rows
        });
    }

    /**
     * Call when the current page is changed
     *
     * @param {PaginationEvent} event
     * @memberof SearchableDropdownComponent
     */
    paginate(event: PaginationEvent): void {
        const paginationEvent = Object.assign({}, event);
        if (this.searchInput) {
            paginationEvent.filter = this.searchInput.nativeElement.value;
        }
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
     *
     * @param {*} fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Get labels from container, if labelPropertyName is an array then loop through it and returns
     * a string containing the labels joining by "-" if is not just returns a label
     *
     * @param {*} dropDownItem
     * @returns {string}
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
     * Call when a option is clicked, if this option is not the same of the current value then the
     * change events is emitted. If multiple is true allow to emit the same value.
     *
     * @param {*} item
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
     *
     * @param {MouseEvent} [$event]
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
     * Resets height value from Overlay Panel
     *
     * @memberof SearchableDropdownComponent
     */
    resetPanelMinHeight(): void {
        this.overlayPanelMinHeight = '';
    }

    private setLabel(): void {
        this.valueString = this.value
            ? this.value[this.getValueLabelPropertyName()]
            : this.placeholder;
        this.label = this.persistentPlaceholder ? this.placeholder : this.valueString;
        this.cd.markForCheck();
    }

    private setOptions(change: SimpleChanges): void {
        if (change.data && change.data.currentValue) {
            this.options = _.cloneDeep(change.data.currentValue).map((item) => {
                item.label = this.getItemLabel(item);
                return item;
            });
        }
    }

    private isModifierKey(key: string): boolean {
        return this.keyMap.includes(key);
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
