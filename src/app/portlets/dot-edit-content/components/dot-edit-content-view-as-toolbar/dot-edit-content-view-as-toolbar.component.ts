import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotPersona } from '../../../../shared/models/dot-persona/dot-persona.model';
import { DotLanguage } from '../../../../shared/models/dot-language/dot-language.model';
import { DotDevice } from '../../../../shared/models/dot-device/dot-device.model';

@Component({
    selector: 'dot-edit-content-view-as-toolbar',
    templateUrl: './dot-edit-content-view-as-toolbar.component.html',
    styleUrls: ['./dot-edit-content-view-as-toolbar.component.scss']
})
export class DotEditContentViewAsToolbarComponent implements OnInit {
    @Input() value: DotEditPageViewAs;
    @Output() changeViewAs = new EventEmitter<DotEditPageViewAs>();
    @Output() changeDevice = new EventEmitter<DotDevice>();

    viewAsConfig: DotEditPageViewAs;

    private defaultDevice: DotDevice = { id: '0', label: 'Desktop', width: '100%', height: '100%' };

    constructor() {}

    ngOnInit() {
        if (!this.value.device) {
            this.changeDeviceHandler(this.defaultDevice);
        }
    }

    /**
     * Track changes in Persona.
     *
     * @param {DotPersona} persona
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changePersonaHandler(persona: DotPersona): void {
        this.value.persona = persona;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Track changes in Language.
     *
     * @param {DotLanguage} language
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeLanguageHandler(language: DotLanguage): void {
        this.value.language = language;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Track changes in Device.
     *
     * @param {DotDevice} device
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeDeviceHandler(device: DotDevice): void {
        this.value.device = device;
        this.changeDevice.emit(this.value.device);
    }
}
