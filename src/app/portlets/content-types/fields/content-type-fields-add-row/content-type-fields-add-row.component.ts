import { BaseComponent } from './../../../../view/components/_common/_base/base-component';
import { Component, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MessageService } from './../../../../api/services/messages-service';

/**
 * Display select columns row
 *
 * @export
 * @class ContentTypeFieldsAddRowComponent
 */

@Component({
    selector: 'dot-add-rows',
    styleUrls: ['./content-type-fields-add-row.component.scss'],
    templateUrl: './content-type-fields-add-row.component.html',
})
export class ContentTypeFieldsAddRowComponent implements OnDestroy, OnInit {
    rowState = 'add';
    selectedColumnIndex = 0;
    i18nMessages = {};

    @Input() colNumberOptions: number[] = [1, 2, 3, 4];
    @Input() disabled = false;
    @Input() toolTips: string[] = [
        'contenttypes.content.one_column',
        'contenttypes.content.two_columns',
        'contenttypes.content.three_columns',
        'contenttypes.content.four_columns'
    ];
    @Output() selectColums: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('colContainer') colContainer: ElementRef;

    constructor(private hotkeysService: HotkeysService , public messageService: MessageService) {
    }

    ngOnInit(): void {
        this.setKeyboardEvent('ctrl+a', this.selectColumnState.bind(this));
        this.loadMessages();
    }

    ngOnDestroy(): void {
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    /**
     * Set columns active when mouse enter
     * @param col
     */
    onMouseEnter(col: number): void {
        this.selectedColumnIndex = col;
        this.setFocus(this.getElementSelected());
        event.preventDefault();
    }

    onMouseLeave(event): void {
        this.removeFocus(event.target);
    }

    /**
     * Emit number of columns after select colum the reset row
     * @memberof ContentTypeFieldsAddRowComponent
     */
    emitColumnNumber(): void {
        this.selectColums.emit(this.getNumberColumnsSelected());
        this.resetState();
    }

    /**
     * Return columns inside each li element
     * @param {number} n
     * @returns {number[]}
     * @memberof ContentTypeFieldsAddRowComponent
     */
    numberOfCols(n: number): number[] {
       return Array(n).fill('');
    }

    /**
     * Display row when click on add rows button
     * @memberof ContentTypeFieldsAddRowComponent
     */
    selectColumnState(): void {
        this.rowState = 'select';
        this.setFocus(this.getElementSelected());
        this.bindKeyboardEvents();
    }

    setFocus(elem: any): void {
        elem.focus();
    }

    removeFocus(elem: any): any {
        return elem.blur();
    }

    setKeyboardEvent(key: string | string[], keyEvent): any {
        this.hotkeysService.add(new Hotkey(key, (event: KeyboardEvent): boolean => {
            keyEvent();
            return false;
        }));
    }

    leftKeyboardEvent(): any {
        this.selectedColumnIndex = this.selectedColumnIndex - 1;

        if (this.selectedColumnIndex < 0) {
            this.selectedColumnIndex = this.getMaxIndex();
        }

        this.setFocus(this.getElementSelected());

    }

    private getElementSelected(): HTMLElement {
        return this.colContainer.nativeElement.children[this.selectedColumnIndex];
    }

    private bindKeyboardEvents(): void {
        this.setKeyboardEvent('left', this.leftKeyboardEvent.bind(this));
        this.setKeyboardEvent('right', this.rightKeyboardEvent.bind(this));
        this.setKeyboardEvent('esc', this.resetState.bind(this));
        this.setKeyboardEvent('enter', this.emitColumnNumber.bind(this));
    }

    private loadMessages(): void {
        const i18nKeys = [
            ...this.toolTips,
            'contenttypes.dropzone.rows.add'
        ];

        this.messageService.getMessages(i18nKeys).subscribe(res => {
            this.i18nMessages = res;
        });
    }

    private getNumberColumnsSelected() {
        return this.colNumberOptions[this.selectedColumnIndex];
    }

    private getMaxIndex(): number {
        return this.colNumberOptions.length - 1;
    }

    private rightKeyboardEvent(): any {
        this.selectedColumnIndex = this.selectedColumnIndex + 1;

        if (this.selectedColumnIndex > this.getMaxIndex()) {
            this.selectedColumnIndex = 0;
        }

        this.setFocus(this.getElementSelected());
    }

    private resetState(): any {
        this.removeFocus(this.getElementSelected());
        this.selectedColumnIndex = 0;
        this.rowState = 'add';
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    private setTooltipValue(col: number): string {
        return this.i18nMessages[this.toolTips[col]];
    }
}
