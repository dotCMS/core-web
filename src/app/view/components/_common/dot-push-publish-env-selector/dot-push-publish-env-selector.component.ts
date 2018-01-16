import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, Input, ViewEncapsulation, forwardRef, ViewChild } from '@angular/core';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel } from '@angular/forms';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-push-publish-env-selector',
    styleUrls: ['./dot-push-publish-env-selector.component.scss'],
    templateUrl: 'dot-push-publish-env-selector.component.html',
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PushPublishEnvSelectorComponent)
        }
    ]
})

export class PushPublishEnvSelectorComponent implements OnInit, ControlValueAccessor {
    @Input() contentTypeId: string;
    @ViewChild('inputModel') inputModel: NgModel;
    pushEnvironments: EnvironmentServers[] = [];
    selectedEnvironment: EnvironmentServers[];
    value: string[] = [];

    constructor(private pushPublishService: PushPublishService, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.pushPublishService.getEnvironments().subscribe(environments => {
            this.pushEnvironments = environments;
        });

        this.dotMessageService.getMessages([
            'contenttypes.content.push_publish.select_environment'
        ]).subscribe();
    }

    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     * @param {*} fn
     * @memberof PushPublishEnvSelectorComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Write a new value to the element
     * Reset value
     * @param {string[]} value
     * @memberof PushPublishEnvSelectorComponent
     */
    writeValue(value: string[]): void {
        if (value) {
            this.value = value || null;
        }
        this.inputModel.reset();
    }

    /**
     * Propagate environment id when multiselect changes
     * @param {any} $event
     * @param {any} selectedEnvironment
     * @memberof PushPublishEnvSelectorComponent
     */
    valueChange($event, selectedEnvironment): void {
        this.propagateEnvironmentId(selectedEnvironment);
    }

    /**
     * Remove selected environments and progagate new environments
     * @param {number} i
     * @memberof PushPublishEnvSelectorComponent
     */
    removeEnvironmentItem(i: number): void {
        this.selectedEnvironment.splice(i, 1);
        this.propagateEnvironmentId(this.selectedEnvironment);
    }

    private propagateEnvironmentId(selectedEnvironment): void {
        const selectedEnvironmentIds = [];
        selectedEnvironment.forEach(environment => {
            selectedEnvironmentIds.push(environment.id);
        });
        this.value = selectedEnvironmentIds;
        this.propagateChange(selectedEnvironmentIds);
    }
}

export interface EnvironmentServers {
    id: string;
    name: string;
}
