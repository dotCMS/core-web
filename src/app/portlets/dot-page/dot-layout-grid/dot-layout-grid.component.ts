import { Component, OnInit } from '@angular/core';
import { NgGrid, NgGridConfig, NgGridItemConfig, NgGridItemEvent } from 'angular2-grid';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

interface DotLayoutBlock {
    id: number;
    config: any;
}

@Component({
    selector: 'dot-layout-grid',
    templateUrl: './dot-layout-grid.component.html',
    styleUrls: ['./dot-layout-grid.component.scss']
})
export class DotLayoutGridComponent implements OnInit {
    public boxes: Array<DotLayoutBlock> = [];
    private static newRowTemplate: NgGridItemConfig = { fixed: true, sizex: 3, maxCols: 12, maxRows: 1 };
    private static defaultEmptyGridRows: NgGridItemConfig = {
        fixed: true,
        sizex: 12,
        maxCols: 12,
        maxRows: 1,
        col: 1,
        row: 1
    };
    actionItems: [any];
    addButton;
    gridConfig: NgGridConfig = <NgGridConfig>{
        margins: [3],
        draggable: true,
        resizable: true,
        max_cols: 12,
        max_rows: 0,
        visible_cols: 12,
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
        this.boxes = [
            {
                id: 0,
                config: Object.assign({}, DotLayoutGridComponent.defaultEmptyGridRows)
            }
        ];
        this.addButton = () => {
            this.addBox();
        };

        // this.actionItems = [
        //     {
        //         command: () => {
        //             console.log('action update');
        //         },
        //         icon: 'fa-refresh',
        //         label: 'Update'
        //     }
        // ];
    }

    addBox(): void {
        let conf: NgGridItemConfig = this.getLastBoxOnGrid();
        conf.payload = 1;
        this.boxes.push({ id: conf.payload, config: conf });
    }

    removeWidget(index: number): void {
        if (this.boxes[index]) {
            this.boxes.splice(index, 1);
        }
    }

    dotOnDragStop(): void {
        this.deleteEmptyRows();
    }

    private getLastBoxOnGrid(): NgGridItemConfig {
        let lastBox;
        let newRow: NgGridItemConfig = Object.assign({}, DotLayoutGridComponent.newRowTemplate);
        if (this.boxes.length) {
            // check last row && last column in last row
            lastBox = this.boxes.reduce((a, b) => {
                return a.config.row > b.config.row
                    ? a
                    : a.config.row == b.config.row ? (a.config.col > b.config.col ? a : b) : b;
            });
            if (lastBox.config.col + 3 < 12) {
                newRow.row = lastBox.config.row;
                newRow.col = lastBox.config.col + lastBox.config.sizex;
            } else {
                newRow.row = lastBox.config.row + 1;
                newRow.col = 1;
            }
        }
        return newRow;
    }

    private deleteEmptyRows(): void {
        setTimeout(() => {
            debugger;
            let containersByRow = [];
            this.boxes.forEach(container => {
                containersByRow[container.config.row] === undefined
                    ? (containersByRow[container.config.row] = new Array(container))
                    : containersByRow[container.config.row].push(container);
            });
            let filteredContainers = containersByRow.filter(contArr => contArr);
            // If is the same size don't re-Order nothing.
            if (filteredContainers.length != containersByRow.length - 1) {
                filteredContainers.forEach((containerArr, index) => {
                    if (containerArr[0].config.row != index + 1)
                        containerArr.forEach(container => (container.config.row = index + 1));
                });
            }
        }, 0);
    }
}
