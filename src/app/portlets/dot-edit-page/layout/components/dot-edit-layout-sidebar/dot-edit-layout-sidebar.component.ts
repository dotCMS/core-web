import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
import { NgGrid, NgGridConfig, NgGridItemConfig } from 'angular2-grid';
import * as _ from 'lodash';
import { DotDialogService } from '../../../../../api/services/dot-dialog/dot-dialog.service';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { DotLayoutGridBox } from '../../../shared/models/dot-layout-grid-box.model';
import {
    DOT_LAYOUT_GRID_MAX_COLUMNS,
    DOT_LAYOUT_GRID_NEW_ROW_TEMPLATE,
    DOT_LAYOUT_DEFAULT_GRID
} from '../../../shared/models/dot-layout.const';
import { DotLayoutBody } from '../../../shared/models/dot-layout-body.model';
import { DotEditLayoutService } from '../../../shared/services/dot-edit-layout.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotEventsService } from '../../../../../api/services/dot-events/dot-events.service';
import { DotLayoutSideBar } from '../../../shared/models/dot-layout-sidebar.model';
import { DotContainerColumnBox } from '../../../shared/models/dot-container-column-box.model';

/**
 * Component in charge of update the model that will be used be the NgGrid to display containers
 *
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-layout-sidebar',
    templateUrl: './dot-edit-layout-sidebar.component.html',
    styleUrls: ['./dot-edit-layout-sidebar.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotEditLayoutSidebarComponent)
        }
    ]
})
export class DotEditLayoutSidebarComponent implements OnInit, ControlValueAccessor {

    value: DotLayoutSideBar;


    constructor(
        private dotDialogService: DotDialogService,
        private dotEditLayoutService: DotEditLayoutService,
        public dotMessageService: DotMessageService,
        private dotEventsService: DotEventsService
    ) {}

    ngOnInit() {

    }

    /**
     * Return ng-grid model.
     *
     * @returns {DotLayoutBody}
     * @memberof DotEditLayoutGridComponent
     */
    getModel(containers: DotContainerColumnBox[]): DotLayoutSideBar {
        console.log('***containers', containers);
        debugger;
        const test = this.dotEditLayoutService.getDotLayoutSidebar(containers);
        console.log('--getDotLayoutBody', test);

        let copy = JSON.parse(JSON.stringify(this.value));
        copy.containers.push(
            {'uuid' : '1523902270595',
            'identifier' : 'd71d56b4-0a8b-4bb2-be15-ffa5a23366ea'
        });


        return copy;
    }

    // tslint:disable-next-line:no-shadowed-variable
    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param {*} fn
     * @memberof DotEditLayoutGridComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Update the model when a container is added to a box
     *
     * @memberof DotEditLayoutGridComponent
     */
    updateContainers(containers: DotContainerColumnBox[]): void {
        debugger;
        this.propagateChange(this.getModel(containers));
    }

    /**
     * Write a new value to the element
     *
     * @param {DotLayoutBody} value
     * @memberof DotEditLayoutGridComponent
     */
    writeValue(value: DotLayoutSideBar): void {
        debugger;
        if (value) {
            this.value = value || null;
            // this.setGridValue();
        }
    }

}
