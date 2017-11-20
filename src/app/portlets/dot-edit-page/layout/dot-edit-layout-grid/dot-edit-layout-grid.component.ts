import { Component, OnInit, Input } from '@angular/core';
import { NgGridConfig, NgGridItemConfig } from 'angular2-grid';
import _ from 'lodash';
import { DotConfirmationService } from '../../../../api/services/dot-confirmation/dot-confirmation.service';
import { MessageService } from '../../../../api/services/messages-service';
import { LayoutGridBox } from '../../shared/models/layout-grid-box.model';
import { PageView } from '../../shared/models/page-view.model';
import { LayoutBody } from '../../shared/models/layout-body.model';
import { LayoutRow } from '../../shared/models/layout-row.model';
import { LayoutColumn } from '../../shared/models/layout-column.model';

/**
 * Component in charge of update the model that will be used be the NgGrid to display containers
 *
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-layout-grid',
    templateUrl: './dot-edit-layout-grid.component.html',
    styleUrls: ['./dot-edit-layout-grid.component.scss']
})
export class DotEditLayoutGridComponent implements OnInit {
    @Input() pageView: PageView;
    public gridContainers: LayoutGridBox[];
    private static MAX_COLUMNS: number = 12;
    private static NEW_ROW_TEMPLATE: NgGridItemConfig = { fixed: true, sizex: 3, maxCols: 12, maxRows: 1 };
    private static DEFAULT_EMPTY_GRID_ROWS: NgGridItemConfig = {
        fixed: true,
        sizex: 12,
        maxCols: 12,
        maxRows: 1,
        col: 1,
        row: 1
    };
    gridConfig: NgGridConfig = <NgGridConfig>{
        margins: [4, 8, 4, 0],
        draggable: true,
        resizable: true,
        max_cols: DotEditLayoutGridComponent.MAX_COLUMNS,
        max_rows: 0,
        visible_cols: DotEditLayoutGridComponent.MAX_COLUMNS,
        // 'visible_rows': 12,
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

    private i18nKeys = [
        'editpage.confirm.header',
        'editpage.confirm.message.delete',
        'editpage.confirm.message.delete.warning',
        'editpage.action.cancel',
        'editpage.action.delete',
        'editpage.action.save'
    ];

    constructor(public messageService: MessageService, private dotConfirmationService: DotConfirmationService) {}

    ngOnInit() {
        this.messageService.getMessages(this.i18nKeys).subscribe();
        if (this.pageView) {
            this.gridContainers = this.transformDataToDisplayOnGrid(this.pageView);
        } else {
            this.gridContainers = [
                {
                    config: Object.assign({}, DotEditLayoutGridComponent.DEFAULT_EMPTY_GRID_ROWS),
                    containers: []
                }
            ];
        }
    }

    /**
     * Add new container to the gridContainers Arrray.
     */
    addContainer(): () => void {
        //TODO: This will change when Action Button get fixed.
        return () => {
            let conf: NgGridItemConfig = this.setConfigOfNewContainer();
            this.gridContainers.push({ config: conf, containers: [] });
        };
    }

    /**
     * Removes the given index to the gridContainers Array after the user confirms.
     * @param {number} index
     */
    onRemoveContainer(index: number): void {
        this.dotConfirmationService.confirm({
            accept: () => {
                this.removeContainer(index);
            },
            header: this.messageService.get('editpage.confirm.header'),
            message: `${this.messageService.get('editpage.confirm.message.delete')} 
                        <span>${this.messageService.get('editpage.confirm.message.delete.warning')}</span>`,
            footerLabel: {
                acceptLabel: this.messageService.get('editpage.action.delete'),
                rejectLabel: this.messageService.get('editpage.action.cancel')
            }
        });
    }

    private removeContainer(index: number): void {
        if (this.gridContainers[index]) {
            this.gridContainers.splice(index, 1);
            this.deleteEmptyRows();
        }
    }

    /**
     * Event fired when the grad of a container ends, remove empty rows if any.
     * @constructor
     */
    OnDragStop(): void {
        this.deleteEmptyRows();
    }

    private setConfigOfNewContainer(): NgGridItemConfig {
        let lastContainer;
        let newRow: NgGridItemConfig = Object.assign({}, DotEditLayoutGridComponent.NEW_ROW_TEMPLATE);
        let busyColumns: number = DotEditLayoutGridComponent.NEW_ROW_TEMPLATE.sizex;
        if (this.gridContainers.length) {
            // check last row && last column in last row
            lastContainer = this.gridContainers.reduce(
                (currentContainer: LayoutGridBox, nextContainer: LayoutGridBox) => {
                    return currentContainer.config.row > currentContainer.config.row
                        ? currentContainer
                        : currentContainer.config.row == nextContainer.config.row
                          ? currentContainer.config.col > nextContainer.config.col ? currentContainer : nextContainer
                          : nextContainer;
                }
            );
            busyColumns += lastContainer.config.col - 1 + lastContainer.config.sizex;
            if (busyColumns <= DotEditLayoutGridComponent.MAX_COLUMNS) {
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
        //TODO: Find a solution to remove setTimeOut
        setTimeout(() => {
            this.gridContainers = _.chain(this.gridContainers)
                .sortBy('config.row')
                .groupBy('config.row')
                .values()
                .map(this.updateContainerIndex)
                .flatten()
                .value();
        }, 0);
    }

    private updateContainerIndex(rowArray, index) {
        if (rowArray[0].row != index + 1) {
            return rowArray.map(container => {
                container.config.row = index + 1;
                return container;
            });
        }
        return rowArray;
    }

    private transformDataToDisplayOnGrid(resp): any {
        let grid = [];
        debugger;
        resp.layout.body.rows.forEach((row, rowIndex) => {
            row.columns.forEach(column => {
                grid.push({
                    containers: column.containers.map(
                        containerId => (resp.containers[containerId] ? resp.containers[containerId].container : containerId)
                    ),
                    config: Object.assign({}, DotEditLayoutGridComponent.NEW_ROW_TEMPLATE, {
                        sizex: column.width,
                        col: column.leftOffset,
                        row: rowIndex + 1
                    })
                });
            });
        });
        return grid;
    }

    public getLayoutBody(): LayoutBody {
        return this.transformDataToLayoutBody();
    }

    private transformDataToLayoutBody(): LayoutBody {
        return <LayoutBody>{
            rows: _.chain(this.gridContainers)
                .sortBy('config.row')
                .sortBy('config.col')
                .groupBy('config.row')
                .values()
                .map(this.convertToLayoutRow)
                .value()
        };
    }

    private convertToLayoutRow(gridBoxes: LayoutGridBox[]): LayoutRow {
        return {
            columns: gridBoxes.map(
                (layoutGridBox: LayoutGridBox) =>
                    <LayoutColumn>{
                        leftOffset: layoutGridBox.config.col,
                        width: layoutGridBox.config.sizex,
                        containers: layoutGridBox.containers.map(container => container.identifier)
                    }
            )
        };
    }
}
