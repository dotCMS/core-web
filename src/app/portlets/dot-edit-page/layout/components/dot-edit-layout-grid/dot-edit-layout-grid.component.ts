import { Component, OnInit, forwardRef, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { DotAlertConfirmService } from '@services/dot-alert-confirm/dot-alert-confirm.service';
import { DotMessageService } from '@services/dot-messages-service';
import { DotLayoutGridBox } from '../../../shared/models/dot-layout-grid-box.model';
import {
    DOT_LAYOUT_GRID_MAX_COLUMNS,
    DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE,
    DOT_LAYOUT_DEFAULT_GRID
} from '../../../shared/models/dot-layout.const';
import { DotLayoutBody } from '../../../shared/models/dot-layout-body.model';
import { DotEditLayoutService } from '../../../shared/services/dot-edit-layout.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { NgGrid, NgGridConfig, NgGridItemConfig } from 'dot-layout-grid';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';

/**
 * Component in charge of update the model that will be used be the NgGrid to display containers
 *
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-layout-grid',
    templateUrl: './dot-edit-layout-grid.component.html',
    styleUrls: ['./dot-edit-layout-grid.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotEditLayoutGridComponent)
        }
    ]
})
export class DotEditLayoutGridComponent implements OnInit, ControlValueAccessor {
    @ViewChild(NgGrid)
    ngGrid: NgGrid;

    @ViewChild('classToAddInput')
    classToAddInput: ElementRef;
    value: DotLayoutBody;
    grid: DotLayoutGridBox[];

    showAddClassDialog = false;
    dialogActions: DotDialogActions;

    rowClasses: string[] = [];

    gridConfig: NgGridConfig = <NgGridConfig>{
        margins: [0, 8, 8, 0],
        draggable: true,
        resizable: true,
        max_cols: DOT_LAYOUT_GRID_MAX_COLUMNS,
        max_rows: 0,
        visible_cols: DOT_LAYOUT_GRID_MAX_COLUMNS,
        min_cols: 1,
        min_rows: 1,
        col_width: 90,
        row_height: 206,
        cascade: 'up',
        min_width: 40,
        min_height: 206,
        fix_to_grid: true,
        auto_style: true,
        auto_resize: true,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false,
        limit_to_screen: true
    };

    constructor(
        private dotDialogService: DotAlertConfirmService,
        private dotEditLayoutService: DotEditLayoutService,
        public dotMessageService: DotMessageService,
        private dotEventsService: DotEventsService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'editpage.confirm.header',
                'editpage.confirm.message.delete',
                'editpage.confirm.message.delete.warning',
                'editpage.action.cancel',
                'editpage.action.delete',
                'editpage.action.save'
            ])
            .subscribe();

        this.dotEventsService.listen('dot-side-nav-toggle').subscribe(() => {
            this.resizeGrid(200);
        });

        this.dotEventsService.listen('layout-sidebar-change').subscribe(() => {
            this.resizeGrid();
        });

        // needed it because the transition between content & layout.
        this.resizeGrid();
    }

    /**
     * Add new Box to the gridBoxes Arrray.
     *
     * @memberof DotEditLayoutGridComponent
     */
    addBox(): void {
        const conf: NgGridItemConfig = this.setConfigOfNewContainer();
        this.grid.push({ config: conf, containers: [] });
        this.propagateGridLayoutChange();
        this.setRowClass();
    }

    /**
     * Return ng-grid model.
     *
     * @returns DotLayoutBody
     * @memberof DotEditLayoutGridComponent
     */
    getModel(): DotLayoutBody {
        return this.dotEditLayoutService.getDotLayoutBody(this.grid, this.rowClasses);
    }

    /**
     * Event fired when the drag or resize of a container ends, remove empty rows if any.
     *
     * @memberof DotEditLayoutGridComponent
     */
    updateModel(): void {
        this.deleteEmptyRows();
        this.propagateGridLayoutChange();
    }

    /**
     * Removes the given index to the gridBoxes Array after the user confirms.
     *
     * @param number index
     * @memberof DotEditLayoutGridComponent
     */
    onRemoveContainer(index: number): void {
        if (this.grid[index].containers.length) {
            this.dotDialogService.confirm({
                accept: () => {
                    this.removeContainer(index);
                },
                header: this.dotMessageService.get('editpage.confirm.header'),
                message: `${this.dotMessageService.get(
                    'editpage.confirm.message.delete'
                )} <span>${this.dotMessageService.get(
                    'editpage.confirm.message.delete.warning'
                )}</span>`,
                footerLabel: {
                    accept: this.dotMessageService.get('editpage.action.delete'),
                    reject: this.dotMessageService.get('editpage.action.cancel')
                }
            });
        } else {
            this.removeContainer(index);
        }
    }

    // tslint:disable-next-line:no-shadowed-variable
    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param * fn
     * @memberof DotEditLayoutGridComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Update the model when the grid is changed
     *
     * @memberof DotEditLayoutGridComponent
     */
    propagateGridLayoutChange(): void {
        this.propagateChange(this.getModel());
    }

    /**
     * Write a new value to the element
     *
     * @param DotLayoutBody value
     * @memberof DotEditLayoutGridComponent
     */
    writeValue(value: DotLayoutBody): void {
        if (value) {
            this.value = value || null;
            this.setGridValue();
        }
    }

    addColumnClass(index: number): void {
        this.addClass(
            () => this.grid[index].config.payload.styleClass || '',
            () => this.grid[index].config.payload.styleClass = this.classToAddInput.nativeElement.value
        );
    }

    addRowClass(index: number): void {
        this.addClass(
            () => this.rowClasses[index],
            () => this.rowClasses[index] = this.classToAddInput.nativeElement.value
        );
    }

    handlerClassToAddInputChanged(): void {
        this.dialogActions = {
            accept: {
                ...this.dialogActions.accept,
                disabled: !this.classToAddInput.nativeElement.value
            },
            cancel: this.dialogActions.cancel
        };
    }

    private addClass(getterFunc: () => string, setterFunc): void {
        this.dialogActions = {
            accept: {
                action: (dialog?: any) => {
                    setterFunc.bind(this)();
                    this.propagateGridLayoutChange();
                    dialog.close();
                },
                label: 'Ok',
                disabled: false
            },
            cancel: {
                label: 'Cancel'
            }
        };

        this.classToAddInput.nativeElement.value = getterFunc.bind(this)();
        this.showAddClassDialog = true;
    }

    private setGridValue(): void {
        this.grid = this.isHaveRows()
            ? this.dotEditLayoutService.getDotLayoutGridBox(this.value)
            : [...DOT_LAYOUT_DEFAULT_GRID];

        this.rowClasses = this.value.rows.map(row => row.styleClass);
        console.log('setGridValue', this.rowClasses, this.value);
        this.setRowClass();
    }

    private setRowClass(): void {
        console.log('setRowClass');
        const newNRows = this.grid
            .map(box => box.config.row)
            .reduce((before, current) => {
                return before > current ? before : current;
            }, 0);
        console.log('nRows', newNRows, this.grid);
        console.log('this.rowClass.length', this.rowClasses.length);

        if (this.rowClasses.length > newNRows) {
            this.rowClasses = this.rowClasses.splice(0, this.rowClasses.length - newNRows);
        } else {
            this.rowClasses = [...this.rowClasses, ...Array(newNRows - this.rowClasses.length).fill(null)];
        }

        console.log('this.rowClass', this.rowClasses, this.rowClasses.length);
    }

    private removeContainer(index: number): void {
        if (this.grid[index]) {
            this.grid.splice(index, 1);
            this.deleteEmptyRows();
            this.propagateGridLayoutChange();
            this.setRowClass();
        }
    }

    private setConfigOfNewContainer(): any {
        const newRow: any = Object.assign({}, DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE);

        if (this.grid.length) {
            const lastContainer = _.chain(this.grid)
                .groupBy('config.row')
                .values()
                .last()
                .maxBy('config.col')
                .value();

            let busyColumns: number = DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE.sizex;

            busyColumns += lastContainer.config.col - 1 + lastContainer.config.sizex;

            if (busyColumns <= DOT_LAYOUT_GRID_MAX_COLUMNS) {
                newRow.row = lastContainer.config.row;
                newRow.col = lastContainer.config.col + lastContainer.config.sizex;
            } else {
                newRow.row = lastContainer.config.row + 1;
                newRow.col = 1;
            }
        }

        return newRow;
    }

    private deleteEmptyRows(): void {
        // TODO: Find a solution to remove setTimeout
        setTimeout(() => {
            this.grid = _.chain(this.grid)
                .sortBy('config.row')
                .groupBy('config.row')
                .values()
                .map(this.updateContainerIndex)
                .flatten()
                .value();
        }, 0);
    }

    private updateContainerIndex(rowArray, index) {
        if (rowArray[0].row !== index + 1) {
            return rowArray.map((container) => {
                container.config.row = index + 1;
                return container;
            });
        }
        return rowArray;
    }

    private isHaveRows(): boolean {
        return !!(this.value && this.value.rows && this.value.rows.length);
    }

    private resizeGrid(timeOut?): void {
        setTimeout(() => {
            this.ngGrid.triggerResize();
        }, timeOut ? timeOut : 0);
    }
}
