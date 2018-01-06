import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DotMessageConfiguration } from '../../../../shared/models/dot-message-configuration/dot-message-configuration.model';

@Component({
    selector: 'dot-dot-message-wrapper',
    templateUrl: './dot-message-wrapper.component.html',
    styleUrls: ['./dot-message-wrapper.component.scss']
})
export class DotMessageWrapperComponent implements OnInit, OnChanges {
    @Input() value: string;
    @Input() config: DotMessageConfiguration;
    iconClass: string;
    visibilityStatus = 'hidden';

    private currentConfig: DotMessageConfiguration = {};
    private icons = {
        loading: 'fa fa-circle-o-notch fa-spin'
    };

    private defaultConfig: DotMessageConfiguration = {
        life: 3000,
        sticky: false,
        iconClass: ''
    };

    constructor() {}

    ngOnInit() {
        Object.assign(this.currentConfig, this.defaultConfig, this.config);
    }

    ngOnChanges(changes: any) {
        this.visibilityStatus = 'visible';
        Object.assign(this.currentConfig, this.defaultConfig);
        if (this.config) {
            Object.assign(this.currentConfig, this.config);
        }
        this.iconClass = this.icons[this.currentConfig.iconClass] || '';
        if (!this.currentConfig.sticky) {
            setTimeout(() => {
                this.visibilityStatus = 'hidden';
            }, this.currentConfig.life);
        }
    }
}
