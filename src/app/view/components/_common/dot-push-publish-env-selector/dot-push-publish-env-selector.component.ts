import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel } from '@angular/forms';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { DotEnvironment } from '../../../../shared/models/dot-environment/dot-environment';
import { Observable } from 'rxjs/Observable';

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
    pushEnvironments: Observable<any>;
    selectedEnvironment: DotEnvironment[];
    value: string[] = [];

    constructor(private pushPublishService: PushPublishService, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.pushEnvironments = this.pushPublishService.getEnvironments();

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
            this.value = value;
        }
        this.selectedEnvironment = [];
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
        selectedEnvironment.map(environment => {
            selectedEnvironmentIds.push(environment.id);
        });
        this.value = selectedEnvironmentIds;
        this.propagateChange(this.value);
    }
}

