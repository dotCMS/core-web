import { Component, OnInit } from '@angular/core';
import { NgGridConfig, NgGridItemConfig } from 'angular2-grid';

//Final Object need to be defined.
interface DotLayoutBlock {
    id: string;
    config: any;
}

@Component({
    selector: 'dot-edit-layout-grid',
    templateUrl: './dot-edit-layout-grid.component.html',
    styleUrls: ['./dot-edit-layout-grid.component.scss']
})
export class DotEditLayoutGridComponent implements OnInit {
    public gridContainers: Array<DotLayoutBlock> = [];
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
        let conf: NgGridItemConfig = this.getLastContainerOnGrid();
        this.gridContainers.push({ id: Math.random().toString(), config: conf });
    }

    removeWidget(index: number): void {
        if (this.gridContainers[index]) {
            this.gridContainers.splice(index, 1);
            this.deleteEmptyRows();
        }
    }

    dotOnDragStop(): void {
        this.deleteEmptyRows();
    }

    private getLastContainerOnGrid(): NgGridItemConfig {
        let lastContainer;
        let newRow: NgGridItemConfig = Object.assign({}, DotEditLayoutGridComponent.newRowTemplate);
        if (this.gridContainers.length) {
            // check last row && last column in last row
            lastContainer = this.gridContainers.reduce((a, b) => {
                return a.config.row > b.config.row
                    ? a
                    : a.config.row == b.config.row ? (a.config.col > b.config.col ? a : b) : b;
            });
            if (
                lastContainer.config.col + DotEditLayoutGridComponent.newRowTemplate.sizex <
                DotEditLayoutGridComponent.maxColumns
            ) {
                newRow.row = lastContainer.config.row;
                newRow.col = lastContainer.config.col + lastContainer.config.sizex;
            } else {
                newRow.row = lastContainer.config.row + 1;
                newRow.col = 1;
            }
        }
        return newRow;
    }

    /**
     *
     */
    private deleteEmptyRows(): void {
        setTimeout(() => {
            let containersByRow = this.sortContainersByRow(this.gridContainers);
            let filteredRows = containersByRow.filter(contArr => contArr);

            // If is the same size don't re-Order nothing.
            if (filteredRows.length != containersByRow.length - 1) {
                filteredRows.forEach((containerArr, index) => {
                    if (containerArr[0].config.row != index + 1)
                        containerArr.forEach(container => (container.config.row = index + 1));
                });
            }
        }, 0);
    }

    private sortContainersByRow(containers: Array<DotLayoutBlock>): Array<DotLayoutBlock[]> {
        let containersByRow = [];
        containers.forEach(container => {
            containersByRow[container.config.row] === undefined
                ? (containersByRow[container.config.row] = new Array(container))
                : containersByRow[container.config.row].push(container);
        });
        return containersByRow;
    }
}
