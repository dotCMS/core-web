import { Injectable } from '@angular/core';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { DotLayoutGridBox } from '../../shared/models/dot-layout-grid-box.model';
import { DotLayoutRow } from '../../shared/models/dot-layout-row.model';
import { DotLayoutColumn } from '../../shared/models/dot-layout-column.model';
import * as _ from 'lodash';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { NgGridItemConfig } from 'angular2-grid';

/**
 * Provide methods to transform data types, to be able to display it in the NgGrid.
 *
 * @class DotEditLayoutGridService
 */
@Injectable()
export class DotEditLayoutGridService {
    constructor() {}

    /**
     * Transform and Object from  DotPageView to DotLayoutGridBox to be able to display it on the Grid
     *
     * @param {DotPageView} dotPageView
     * @param {NgGridItemConfig} newRow
     * @returns {DotLayoutGridBox[]}
     */
    getDotLayoutGridBox(dotPageView: DotPageView, newRow: NgGridItemConfig): DotLayoutGridBox[] {
        const grid: DotLayoutGridBox[] = [];
        dotPageView.layout.body.rows.forEach((row, rowIndex) => {
            row.columns.forEach(column => {
                grid.push({
                    containers: column.containers.map(
                        containerId =>
                            dotPageView.containers[containerId]
                                ? dotPageView.containers[containerId].container
                                : containerId
                    ),
                    config: Object.assign({}, newRow, {
                        sizex: column.width,
                        col: column.leftOffset,
                        row: rowIndex + 1
                    })
                });
            });
        });
        return grid;
    }

    /**
     * Transform an array of DotLayoutGridBox to DotLayoutBody.
     *
     * @param {DotLayoutGridBox[]} grid
     * @returns {DotLayoutBody}
     */
    getDotLayoutBody(grid: DotLayoutGridBox[]): DotLayoutBody {
        return <DotLayoutBody>{
            rows: _.chain(grid)
                .sortBy('config.row')
                .sortBy('config.col')
                .groupBy('config.row')
                .values()
                .map(this.convertToLayoutRow)
                .value()
        };
    }

    private convertToLayoutRow(gridBoxes: DotLayoutGridBox[]): DotLayoutRow {
        return {
            columns: gridBoxes.map(
                (layoutGridBox: DotLayoutGridBox) =>
                    <DotLayoutColumn>{
                        leftOffset: layoutGridBox.config.col,
                        width: layoutGridBox.config.sizex,
                        containers: layoutGridBox.containers.map(container => container.identifier)
                    }
            )
        };
    }
}
