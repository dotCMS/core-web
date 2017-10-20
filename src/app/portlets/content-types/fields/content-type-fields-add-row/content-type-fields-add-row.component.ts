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
export class ContentTypeFieldsAddRowComponent implements OnDestroy, OnChanges, OnInit {
    rowState = 'add';
    selectedColumnIndex = 0;
    i18nMessages = {};

    @Input() colNumberOptions: number[] = [1, 2, 3, 4];
    @Input() disabled = false;
    @Input() toolTips: string[];
    @Output() selectColums: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('colContainer') colContainer: ElementRef;

    constructor(private hotkeysService: HotkeysService , public messageService: MessageService) {
    }

    ngOnInit(): void {
        if (!this.toolTips) {
            this.reloadDefaultTooltips();
        }

        this.setKeyboardEvent('ctrl+a', this.selectColumnState.bind(this));
    }

    ngOnChanges(change: SimpleChanges): void {
        if (change.toolTips) {
            this.loadMessages();
        }
    }

    ngOnDestroy(): void {
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    /**
     * Set columns active when mouse enter
     * @param col
     */
    onMouseEnter(col: number, event) {
        this.setFocus(event.target);
        this.selectedColumnIndex = col;
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
        this.resetRow();
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
        this.setFocus(null, this.selectedColumnIndex);

        this.setKeyboardEvent('left', this.leftKeyboardEvent.bind(this));
        this.setKeyboardEvent('right', this.rightKeyboardEvent.bind(this));
        this.setKeyboardEvent('esc', this.resetRow.bind(this));
        this.setKeyboardEvent('enter', this.emitColumnNumber.bind(this));
    }

    setFocus(elem: any, colIndex?: number): any {
        if (colIndex || colIndex === 0) {
            return this.colContainer.nativeElement.children[colIndex].focus();
        }
        return elem.focus();
    }

    removeFocus(elem: any, colIndex?: number): any {
        if (colIndex || colIndex === 0) {
            return this.colContainer.nativeElement.children[colIndex].blur();
        }
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

        this.setFocus(null, this.selectedColumnIndex);
    }

    private reloadDefaultTooltips(): void {
        this.toolTips = [
            'contenttypes.content.one_column',
            'contenttypes.content.two_columns',
            'contenttypes.content.three_columns',
            'contenttypes.content.four_columns'
        ];
        this.loadMessages();
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

        this.setFocus(null, this.selectedColumnIndex);
    }

    private resetRow(): any {
        this.removeFocus(null, this.selectedColumnIndex);
        this.selectedColumnIndex = 0;
        this.rowState = 'add';
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    private setTooltipValue(col: number): string {
        return this.i18nMessages[this.toolTips[col]];
    }
}
