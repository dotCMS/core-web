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

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    writeValue(value: string[]): void {
        if (value) {
            this.value = value || null;
        }
        this.inputModel.reset();
    }

    valueChange($event, selectedEnvironment): void {
        this.propagateEnvironmentId(selectedEnvironment);
    }

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
