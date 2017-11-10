import { Component, OnInit } from '@angular/core';
import { NgGrid, NgGridConfig, NgGridItemConfig, NgGridItemEvent } from 'angular2-grid';

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
    private static defaultEmptyGridRows: NgGridItemConfig[] = [
        { fixed: true, sizex: 12, maxCols: 12, maxRows: 1, col: 1, row: 1 }
    ];
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
        const conf: NgGridItemConfig = this.getLastBoxOnGrid();
        conf.payload = 1;
        this.boxes.push({ id: conf.payload, config: conf });
    }

    removeWidget(index: number): void {
        if (this.boxes[index]) {
            this.boxes.splice(index, 1);
        }
    }

    updateItem(index: number, event: NgGridItemEvent): void {
        // Do something here
    }

    onDrag(index: number, event: NgGridItemEvent): void {
        // Do something here
    }

    onResize(index: number, event: NgGridItemEvent): void {
        // Do something here
    }

    onGridChanges(items) {
        // debugger;
    }

    private getLastBoxOnGrid(): NgGridItemConfig {
        let lastBox;
        let newRow: NgGridItemConfig = Object.assign({}, DotLayoutGridComponent.newRowTemplate);
        lastBox = this.boxes.reduce((a, b) => {
            /*if (a.config.row > b.config.row) return a;
            else if (a.config.row == b.config.row) return a.config.col > b.config.col ? a : b;
            return b; */

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
        return newRow;
    }
}
