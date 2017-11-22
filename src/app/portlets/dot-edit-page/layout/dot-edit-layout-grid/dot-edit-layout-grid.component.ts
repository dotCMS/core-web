import { Component, OnInit, Input } from '@angular/core';
import { NgGridConfig, NgGridItemConfig } from 'angular2-grid';
import * as _ from 'lodash';
import { DotConfirmationService } from '../../../../api/services/dot-confirmation/dot-confirmation.service';
import { MessageService } from '../../../../api/services/messages-service';
import { DotLayoutGridBox } from '../../shared/models/dot-layout-grid-box.model';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { DotEditLayoutGridService } from './dot-edit-layout-grid.service';

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
    private static MAX_COLUMNS = 12;
    private static NEW_ROW_TEMPLATE: NgGridItemConfig = { fixed: true, sizex: 3, maxCols: 12, maxRows: 1 };
    private static DEFAULT_EMPTY_GRID_ROWS: NgGridItemConfig = {
        fixed: true,
        sizex: 12,
        maxCols: 12,
        maxRows: 1,
        col: 1,
        row: 1
    };
    @Input() pageView: DotPageView;
    public gridBoxes: DotLayoutGridBox[];
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

    constructor(
        public messageService: MessageService,
        private dotConfirmationService: DotConfirmationService,
        private dotEditLayoutGridService: DotEditLayoutGridService
    ) {}

    ngOnInit() {
        this.messageService.getMessages(this.i18nKeys).subscribe();
        if (this.pageView) {
            this.gridBoxes = this.dotEditLayoutGridService.getDotLayoutGridBox(
                this.pageView,
                DotEditLayoutGridComponent.NEW_ROW_TEMPLATE
            );
        } else if (!this.gridBoxes) {
            this.gridBoxes = [
                {
                    config: Object.assign({}, DotEditLayoutGridComponent.DEFAULT_EMPTY_GRID_ROWS),
                    containers: []
                }
            ];
        }
    }

    /**
     * Add new Box to the gridBoxes Arrray.
     */
    addContainer(): () => void {
        // TODO: This will change when Action Button get fixed.
        return () => {
            const conf: NgGridItemConfig = this.setConfigOfNewContainer();
            this.gridBoxes.push({ config: conf, containers: [] });
        };
    }

    /**
     * Removes the given index to the gridBoxes Array after the user confirms.
     * @param {number} index
     */
    onRemoveContainer(index: number): void {
        this.dotConfirmationService.confirm({
            accept: () => {
                this.removeContainer(index);
            },
            header: this.messageService.get('editpage.confirm.header'),
            message: `${this.messageService.get('editpage.confirm.message.delete')}<span>${this.messageService.get(
                'editpage.confirm.message.delete.warning'
            )}</span>`,
            footerLabel: {
                acceptLabel: this.messageService.get('editpage.action.delete'),
                rejectLabel: this.messageService.get('editpage.action.cancel')
            }
        });
    }

    /**
     * Event fired when the grad of a container ends, remove empty rows if any.
     * @constructor
     */
    OnDragStop(): void {
        this.deleteEmptyRows();
    }

    /**
     * Transform the grid data into DotLayoutBody.
     * @returns {DotLayoutBody}
     */
    getLayoutBody(): DotLayoutBody {
        return this.dotEditLayoutGridService.getDotLayoutBody(this.gridBoxes);
    }

    private removeContainer(index: number): void {
        if (this.gridBoxes[index]) {
            this.gridBoxes.splice(index, 1);
            this.deleteEmptyRows();
        }
    }

    private setConfigOfNewContainer(): NgGridItemConfig {
        let lastContainer;
        const newRow: NgGridItemConfig = Object.assign({}, DotEditLayoutGridComponent.NEW_ROW_TEMPLATE);
        let busyColumns: number = DotEditLayoutGridComponent.NEW_ROW_TEMPLATE.sizex;
        if (this.gridBoxes.length) {
            // check last row && last column in last row
            lastContainer = this.gridBoxes.reduce(
                (currentContainer: DotLayoutGridBox, nextContainer: DotLayoutGridBox) => {
                    return currentContainer.config.row > currentContainer.config.row
                        ? currentContainer
                        : currentContainer.config.row === nextContainer.config.row
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
        // TODO: Find a solution to remove setTimeOut
        setTimeout(() => {
            this.gridBoxes = _.chain(this.gridBoxes)
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
            return rowArray.map(container => {
                container.config.row = index + 1;
                return container;
            });
        }
        return rowArray;
    }
}
