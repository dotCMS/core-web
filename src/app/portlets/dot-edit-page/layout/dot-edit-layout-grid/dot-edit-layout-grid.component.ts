import { Component, OnInit } from '@angular/core';
import { NgGridConfig, NgGridItemConfig } from 'angular2-grid';
import _ from 'lodash';

//Final Object need to be defined.
interface DotLayoutContainer {
    id: string;
    config: NgGridItemConfig;
}

@Component({
    selector: 'dot-edit-layout-grid',
    templateUrl: './dot-edit-layout-grid.component.html',
    styleUrls: ['./dot-edit-layout-grid.component.scss']
})
export class DotEditLayoutGridComponent implements OnInit {
    public gridContainers: Array<DotLayoutContainer> = [];
    private static maxColumns: number = 12;
    private static newRowTemplate: NgGridItemConfig = { fixed: true, sizex: 3, maxCols: 12, maxRows: 1 };
    private static defaultEmptyGridRows: NgGridItemConfig = {
        fixed: true,
        sizex: 12,
        maxCols: 12,
        maxRows: 1,
        col: 1,
        row: 1
    };
    addButton;
    gridConfig: NgGridConfig = <NgGridConfig>{
        margins: [6, 6, 0, 0],
        draggable: true,
        resizable: true,
        max_cols: DotEditLayoutGridComponent.maxColumns,
        max_rows: 0,
        visible_cols: DotEditLayoutGridComponent.maxColumns,
        // 'visible_rows': 12,
        min_cols: 1,
        min_rows: 1,
        col_width: 90,
        row_height: 200,
        cascade: 'up',
        min_width: 40,
        min_height: 190,
        fix_to_grid: true,
        auto_style: true,
        auto_resize: true,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false,
        limit_to_screen: true
    };

    constructor() {}

    ngOnInit() {
        console.log('test');
        this.gridContainers = [
            {
                id: Math.random().toString(),
                config: Object.assign({}, DotEditLayoutGridComponent.defaultEmptyGridRows)
            }
        ];
        this.addButton = () => {
            this.addBox();
        };
    }

    addBox(): void {
        let conf: NgGridItemConfig = this.setConfigOfNewContainer();
        this.gridContainers.push({ id: Math.random().toString(), config: conf });
    }

    removeContainer(index: number): void {
        if (this.gridContainers[index]) {
            this.gridContainers.splice(index, 1);
            this.deleteEmptyRows();
        }
    }

    dotOnDragStop(): void {
        this.deleteEmptyRows();
    }

    private setConfigOfNewContainer(): NgGridItemConfig {
        let lastContainer;
        let newRow: NgGridItemConfig = Object.assign({}, DotEditLayoutGridComponent.newRowTemplate);
        if (this.gridContainers.length) {
            //TODO: Try to make this simpler with lodash.
            // check last row && last column in last row
            lastContainer = this.gridContainers.reduce((a, b) => {
                return a.config.row > b.config.row
                    ? a
                    : a.config.row == b.config.row ? (a.config.col > b.config.col ? a : b) : b;
            });
            if ((lastContainer.config.col-1 + lastContainer.config.sizex +
                    DotEditLayoutGridComponent.newRowTemplate.sizex) <=
                DotEditLayoutGridComponent.maxColumns
            ){
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
}
