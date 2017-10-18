import { BaseComponent } from './../../../../view/components/_common/_base/base-component';
import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MessageService } from './../../../../api/services/messages-service';

/**
 * Display select columns row
 *
 * @export
 * @class ContentTypeFieldsAddRowComponent
 */

const MAX_COLUMNS = 3;

@Component({
    selector: 'dot-add-rows',
    styleUrls: ['./content-type-fields-add-row.component.scss'],
    templateUrl: './content-type-fields-add-row.component.html',
})
export class ContentTypeFieldsAddRowComponent extends BaseComponent implements OnDestroy {
    rows: number[] = [1, 2, 3, 4];
    rowState = 'add';
    selectedLi = 0;
    @Input() disabledButton = false;
    @Output() selectColums: EventEmitter<number> = new EventEmitter<number>();

    constructor(private hotkeysService: HotkeysService , public messageService: MessageService) {
        super(
            [
                'contenttypes.dropzone.rows.add',
                'contenttypes.content.one_column',
                'contenttypes.content.two_columns',
                'contenttypes.content.three_columns',
                'contenttypes.content.four_columns'
            ],
            messageService
        );
    }

    ngOnDestroy(): void {
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    /**
     * Set columns active when mouse enter
     * @param col
     */
    onMouseOver(col: number, event) {
        this.selectedLi = col;
        event.stopPropagation();
    }

    /**
     * Emit number of columns after select colum the reset row
     * @memberof ContentTypeFieldsAddRowComponent
     */
    selectRow(): void {
        this.selectColums.emit(this.selectedLi + 1);
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

        this.setKeyboardEvent('left', this.leftKeyboardEvent.bind(this));
        this.setKeyboardEvent('right', this.rightKeyboardEvent.bind(this));
        this.setKeyboardEvent('esc', this.resetRow.bind(this));
        this.setKeyboardEvent('enter', this.selectRow.bind(this));
    }

    private setKeyboardEvent(key: string, keyEvent): any {
        this.hotkeysService.add(new Hotkey(key, (event: KeyboardEvent): boolean => {
            keyEvent();
            return false;
        }));
    }

    private leftKeyboardEvent(): any {
        this.selectedLi = this.selectedLi - 1;
        if (this.selectedLi < 0) {
            this.selectedLi = MAX_COLUMNS;
        }
    }

    private rightKeyboardEvent(): any {
        this.selectedLi = this.selectedLi + 1;
        if (this.selectedLi > MAX_COLUMNS) {
            this.selectedLi = 0;
        }
    }

    private resetRow(): any {
        this.selectedLi = 0;
        this.rowState = 'add';
        this.hotkeysService.remove(this.hotkeysService.get(['left', 'right', 'enter', 'esc']));
    }

    private setTooltipValue(col: number): string {
        const toolTipValueMap = [
            'contenttypes.content.one_column',
            'contenttypes.content.two_columns',
            'contenttypes.content.three_columns',
            'contenttypes.content.four_columns'
        ];

        return this.i18nMessages[toolTipValueMap[col]];
    }
}
