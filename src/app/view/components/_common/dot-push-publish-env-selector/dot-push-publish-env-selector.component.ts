import { Component, OnInit, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { PushPublishService } from '@services/push-publish/push-publish.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DotMessageService } from '@services/dot-messages-service';
import { DotEnvironment } from '@models/dot-environment/dot-environment';
import { Observable } from 'rxjs';
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
    @Input()
    assetIdentifier: string;
    pushEnvironments$: Observable<any>;
    selectedEnvironments: DotEnvironment[];
    selectedEnvironmentIds: string[] = [];
    messages: {
        [key: string]: string;
    } = {};

    value: string[];

    constructor(
        private pushPublishService: PushPublishService,
        public dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.pushEnvironments$ = this.pushPublishService.getEnvironments();
        this.pushPublishService.getEnvironments().subscribe((environments) => {
            if (this.pushPublishService.lastEnvironmentPushed) {
                this.selectedEnvironments = environments.filter((env) => {
                    return this.pushPublishService.lastEnvironmentPushed.includes(env.id);
                });
                this.valueChange('', this.selectedEnvironments);
            } else if (environments.length === 1) {
                this.selectedEnvironments = environments;
                this.valueChange('', this.selectedEnvironments);
            }
        });
        this.dotMessageService
            .getMessages(['contenttypes.content.push_publish.select_environment'])
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
            });
    }

    propagateChange = (_: any) => {};
    propagateTouched = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     * @param * fn
     * @memberof PushPublishEnvSelectorComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouched = fn;
    }

    /**
     * Write a new value to the element
     * Reset value
     * @param string[] value
     * @memberof PushPublishEnvSelectorComponent
     */
    writeValue(value: string[]): void {
        if (value) {
            this.selectedEnvironmentIds = value;
        }
        this.selectedEnvironments = [];
    }

    /**
     * Propagate environment id when multiselect changes
     * @param any $event
     * @param any selectedEnvironments
     * @memberof PushPublishEnvSelectorComponent
     */
    valueChange(_event, selectedEnvironments): void {
        this.propagateEnvironmentId(selectedEnvironments);
    }

    /**
     * Remove selected environments and progagate new environments
     * @param DotEnvironment i
     * @memberof PushPublishEnvSelectorComponent
     */
    removeEnvironmentItem(environmentItem: DotEnvironment): void {
        this.selectedEnvironments = this.selectedEnvironments.filter(
            (environment) => environment.id !== environmentItem.id
        );
        this.propagateEnvironmentId(this.selectedEnvironments);
    }

    private propagateEnvironmentId(selectedEnvironments): void {
        this.selectedEnvironmentIds = selectedEnvironments.map((environment) => environment.id);
        this.propagateChange(this.selectedEnvironmentIds);
        this.propagateTouched(this.selectedEnvironmentIds);
    }
}
