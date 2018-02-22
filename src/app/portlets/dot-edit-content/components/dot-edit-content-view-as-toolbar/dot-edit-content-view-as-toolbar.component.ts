import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotDevicesService } from '../../../../api/services/dot-devices/dot-devices.service';
import { DotLanguagesService } from '../../../../api/services/dot-languages/dot-languages.service';
import { DotPersonasService } from '../../../../api/services/dot-personas/dot-personas.service';
import { Persona } from '../../../../shared/models/persona/persona.model';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../../../shared/models/language/language.model';
import { Device } from '../../../../shared/models/device/device.model';

@Component({
    selector: 'dot-edit-content-view-as-toolbar',
    templateUrl: './dot-edit-content-view-as-toolbar.component.html',
    styleUrls: ['./dot-edit-content-view-as-toolbar.component.scss']
})
export class DotEditContentViewAsToolbarComponent implements OnInit {
    @Output() changeViewAs = new EventEmitter<DotEditPageViewAs>();
    @Output() changeDevice = new EventEmitter<string>();

    languagesOptions: SelectItem[];
    personasOptions: SelectItem[];
    devicesOptions: SelectItem[];

    viewAsConfig: DotEditPageViewAs;

    constructor(
        private dotDevicesService: DotDevicesService,
        private dotLanguagesService: DotLanguagesService,
        private dotPersonasService: DotPersonasService
    ) {}

    ngOnInit() {
        Observable.forkJoin(
            this.dotPersonasService.get(),
            this.dotLanguagesService.get(),
            this.dotDevicesService.get()
        ).subscribe(response => {
            this.personasOptions = response[0].map((persona: Persona) => this.getPersonaFieldOption(persona));
            this.languagesOptions = response[1].map((language: Language) => this.getLanguageFieldOption(language));
            this.devicesOptions = response[2].map((device: Device) => this.getDeviceFieldOption(device));

            this.viewAsConfig = {
                language: this.languagesOptions[0].value,
                user: this.personasOptions[0].value,
                device: this.devicesOptions[0].value
            };
        });
    }

    /**
     * Track changes in language and persona.
     */
    changeConfiguration() {
        this.changeViewAs.emit(this.viewAsConfig);
    }

    /**
     * Track changes in the device.
     */
    changeDeviceConfiguration() {
        this.changeDevice.emit(this.viewAsConfig.device);
    }

    private getPersonaFieldOption(persona: Persona): SelectItem {
        return {
            label: persona.label,
            value: persona.id
        };
    }

    private getLanguageFieldOption(language: Language): SelectItem {
        return {
            label: language.label,
            value: language.id
        };
    }

    private getDeviceFieldOption(device: Device): SelectItem {
        return {
            label: device.label,
            value: device.id
        };
    }
}
