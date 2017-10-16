import { BaseComponent } from './../../../../view/components/_common/_base/base-component';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FieldRow } from '../shared';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageService } from './../../../../api/services/messages-service';

/**
 * Display select columns row
 *
 * @export
 * @class ContentTypeFieldsAddRowComponent
 */
@Component({
    selector: 'content-type-fields-add-row',
    animations: [
        trigger('enterAnimation', [
            state(
                'expanded',
                style({
                    height: '*',
                    overflow: 'visible'
                })
            ),
            state(
                'collapsed',
                style({
                    height: '0px',
                    overflow: 'hidden'
                })
            ),
            transition('expanded <=> collapsed', animate('300ms ease-in-out'))
        ])
    ],
    styleUrls: ['./content-type-fields-add-row.component.scss'],
    templateUrl: './content-type-fields-add-row.component.html',
})
export class ContentTypeFieldsAddRowComponent extends BaseComponent implements OnInit, OnDestroy {
    rows: number[] = [1, 2, 3, 4];
    row: number;
    fieldRows: FieldRow[];
    addRowSelected = 'collapsed';
    selectedCol = 0;
    disabledButton = false;
    comboHotKeys: Hotkey;
    @Output() selectedColums: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild('rowList') rowList: ElementRef;

    constructor(private hotkeysService: HotkeysService , public messageService: MessageService) {
        super(
            [
                'contenttypes.content.add_rows'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.comboHotKeys = new Hotkey(['left', 'right', 'enter', 'esc'], (event: KeyboardEvent, combo: string): boolean => {
            switch (combo) {
                case 'left':
                    this.leftKeyboardSelect();
                    break;
                case 'right':
                    this.rightKeyboardSelect();
                    break;
                case 'enter':
                    this.row = this.setRowListChild(this.selectedCol).children.length;
                    this.selectRow(this.row);
                    break;
                case 'esc':
                    this.resetRow();
                    break;
            }
            return false;
        });

        this.hotkeysService.add(this.comboHotKeys);
    }

    ngOnDestroy(): void {
        this.hotkeysService.remove(this.comboHotKeys);
    }

    /**
     * Set columns active when mouse enter
     * @param col
     */
    public mouseEnter(col: number) {
        this.selectedCol = col;
    }

    /**
     * Emit number of columns after select colum the reset row
     * @param {number} row
     * @memberof ContentTypeFieldsAddRowComponent
     */
    public selectRow(row: number): void {
        this.selectedColums.emit(row);
        this.resetRow();
    }

    /**
     * Return columns inside each li element
     * @param {number} n
     * @returns {number[]}
     * @memberof ContentTypeFieldsAddRowComponent
     */
    public numberOfCols(n: number): number[] {
        return Array(n).fill('');
    }

    /**
     * Display row when click on add rows button
     * @memberof ContentTypeFieldsAddRowComponent
     */
    public addRow(): void {
        this.addRowSelected = 'expanded';
    }

    private leftKeyboardSelect(): any {
        this.selectedCol = this.selectedCol - 1;
        if (this.selectedCol < 0) {
            this.selectedCol = 3;
        }
    }

    private rightKeyboardSelect(): any {
        this.selectedCol = this.selectedCol + 1;
        if (this.selectedCol > 3) {
            this.selectedCol = 0;
        }
    }

    private setRowListChild(col: number): any {
        return this.rowList.nativeElement.children[col];
    }

    private resetRow(): any {
        this.selectedCol = 0;
        this.addRowSelected = 'collapsed';
    }

    private setTooltipValue(col: number): string {
        let tooltipValue: string;
        switch (col) {
            case 0:
                tooltipValue = this.i18nMessages['contenttypes.content.one_column'];
                break;
            case 1:
                tooltipValue = this.i18nMessages['contenttypes.content.two_columns'];
                break;
            case 2:
                tooltipValue = this.i18nMessages['contenttypes.content.three_columns'];
                break;
            case 3:
                tooltipValue = this.i18nMessages['contenttypes.content.four_columns'];
                break;
        }
        return tooltipValue;
    }
}
