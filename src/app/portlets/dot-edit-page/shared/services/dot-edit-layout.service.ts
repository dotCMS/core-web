import { Injectable } from '@angular/core';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { DotLayoutGridBox } from '../../shared/models/dot-layout-grid-box.model';
import { DotLayoutRow } from '../../shared/models/dot-layout-row.model';
import { DotLayoutColumn } from '../../shared/models/dot-layout-column.model';
import * as _ from 'lodash';
import { DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE } from '../../shared/models/dot-layout.const';
import { TemplateContainersCacheService } from '../../template-containers-cache.service';
import { DotPageContainer } from '../models/dot-page-container.model';
import { DotContainerColumnBox } from '../models/dot-container-column-box.model';

/**
 * Provide methods to transform NgGrid model into PageView model and viceversa.
 *
 * @class DotEditLayoutService
 */
@Injectable()
export class DotEditLayoutService {
    constructor(private templateContainersCacheService: TemplateContainersCacheService) {}

    /**
     * Take an DotPageView and return an array of DotLayoutGridBox
     *
     * @param DotLayoutBody dotLayoutBody
     * @returns DotLayoutGridBox[]
     */
    getDotLayoutGridBox(dotLayoutBody: DotLayoutBody): DotLayoutGridBox[] {
        const grid: DotLayoutGridBox[] = [];

        dotLayoutBody.rows.forEach((row, rowIndex) => {
            row.columns.forEach(column => {
                grid.push({
                    containers: this.getDotContainerColumnBoxFromDotPageContainer(
                        column.containers
                    ),
                    config: Object.assign({}, DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE, {
                        sizex: column.width,
                        col: column.leftOffset,
                        row: rowIndex + 1,
                        payload: {
                            styleClass: column.styleClass
                        }
                    })
                });
            });
        });

        return grid;
    }

    /**
     * Take an array of DotLayoutGridBox and return a DotLayoutBody.
     *
     * @param DotLayoutGridBox[] grid
     * @returns DotLayoutBody
     */
    getDotLayoutBody(grid: DotLayoutGridBox[], rowClasses?: string[]): DotLayoutBody {
        return <DotLayoutBody>{
            rows: _.chain(grid)
                .sortBy('config.row')
                .sortBy('config.col')
                .groupBy('config.row')
                .values()
                .map((dotLayoutGrid: DotLayoutGridBox[], index: number) =>
                    this.getLayoutRowFromLayoutGridBoxes(dotLayoutGrid, rowClasses ? rowClasses[index] : '')
                )
                .value()
        };
    }

    /**
     * Remove the extra attributes that come from the server and are not longer needed in DotLayoutBody.
     * @param DotLayoutBody grid
     * @returns DotLayoutBody
     */
    cleanupDotLayoutBody(layoutBody: DotLayoutBody): DotLayoutBody {
        return this.getDotLayoutBody(this.getDotLayoutGridBox(layoutBody), layoutBody.rows.map(row => row.styleClass));
    }

    /**
     * Take an array of DotPageContainer and return a DotContainerColumnBox.
     *
     * @param DotPageContainer[] containers
     * @returns DotContainerColumnBox[]
     */
    getDotLayoutSidebar(containers: DotPageContainer[]): DotContainerColumnBox[] {
        return this.getDotContainerColumnBoxFromDotPageContainer(containers);
    }

    private getDotContainerColumnBoxFromDotPageContainer(
        containers: DotPageContainer[]
    ): DotContainerColumnBox[] {
        return containers
            .filter(dotPageContainer =>
                this.templateContainersCacheService.get(dotPageContainer.identifier)
            )
            .map((dotPageContainer: DotPageContainer) => {
                return {
                    container: this.templateContainersCacheService.get(dotPageContainer.identifier),
                    uuid: dotPageContainer.uuid ? dotPageContainer.uuid : ''
                };
            });
    }

    private getLayoutRowFromLayoutGridBoxes(gridBoxes: DotLayoutGridBox[], styleClass: string): DotLayoutRow {
        return {
            styleClass: styleClass,
            columns: gridBoxes.map(
                (layoutGridBox: DotLayoutGridBox) =>
                    <DotLayoutColumn>{
                        leftOffset: layoutGridBox.config.col,
                        width: layoutGridBox.config.sizex,
                        styleClass: layoutGridBox.config.payload.styleClass,
                        containers: layoutGridBox.containers
                            .filter(dotContainersColumnBox => dotContainersColumnBox.container)
                            .map(
                                (dotContainersColumnBox: DotContainerColumnBox) =>
                                    <DotPageContainer>{
                                        identifier: this.templateContainersCacheService.getContainerReference(
                                            dotContainersColumnBox.container
                                        ),
                                        uuid: dotContainersColumnBox.uuid
                                    }
                            )
                    }
            )
        };
    }
}
