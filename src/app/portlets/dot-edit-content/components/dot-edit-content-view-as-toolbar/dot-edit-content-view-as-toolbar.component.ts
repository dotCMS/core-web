import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotDevicesService } from '../../../../api/services/dot-devices/dot-devices.service';
import { DotLanguagesService } from '../../../../api/services/dot-languages/dot-languages.service';
import { DotPersonasService } from '../../../../api/services/dot-personas/dot-personas.service';
import { DotPersona } from '../../../../shared/models/dot-persona/dot-persona.model';
import { Observable } from 'rxjs/Observable';
import { DotLanguage } from '../../../../shared/models/dot-language/dot-language.model';
import { DotDevice } from '../../../../shared/models/dot-device/dot-device.model';
import { DotViewAsService } from '../../../../api/services/dot-view-as/dot-view-as.service';

@Component({
    selector: 'dot-edit-content-view-as-toolbar',
    templateUrl: './dot-edit-content-view-as-toolbar.component.html',
    styleUrls: ['./dot-edit-content-view-as-toolbar.component.scss']
})
export class DotEditContentViewAsToolbarComponent implements OnInit {
    @Output() changeViewAs = new EventEmitter<DotEditPageViewAs>();
    @Output() changeDevice = new EventEmitter<DotDevice>();

    languagesOptions: SelectItem[];
    personasOptions: SelectItem[];
    devicesOptions: SelectItem[];

    viewAsConfig: DotEditPageViewAs;

    constructor(
        private dotDevicesService: DotDevicesService,
        private dotLanguagesService: DotLanguagesService,
        private dotPersonasService: DotPersonasService,
        private dotViewAsService: DotViewAsService
    ) {}

    ngOnInit() {
        this.viewAsConfig = { language: null, persona: null };
        Observable.forkJoin(
            this.dotPersonasService.get(),
            this.dotLanguagesService.get(),
            this.dotDevicesService.get()
        ).subscribe(response => {
            this.personasOptions = response[0].map((persona: DotPersona) => this.getPersonaFieldOption(persona));
            this.languagesOptions = response[1].map((language: DotLanguage) => this.getLanguageFieldOption(language));
            this.devicesOptions = response[2].map((device: DotDevice) => this.getDeviceFieldOption(device));
            this.setInitialConfiguration();
        });
    }

    /**
     * Track changes in dot-language and dot-persona.
     */
    changeConfiguration() {
        this.dotViewAsService.selected = this.viewAsConfig;
        this.changeViewAs.emit(this.dotViewAsService.selected);
    }

    /**
     * Track changes in the dot-device.
     */
    changeDeviceConfiguration() {
        this.dotViewAsService.selected = this.viewAsConfig;
        this.changeDevice.emit(this.viewAsConfig.device);
    }

    private setInitialConfiguration() {
        debugger;
        this.viewAsConfig = this.dotViewAsService.selected || {
            language: this.languagesOptions[0].value,
            persona: this.personasOptions[0].value,
            device: this.devicesOptions[0].value
        };
        this.changeDevice.emit(this.viewAsConfig.device);
    }

    private getPersonaFieldOption(persona: DotPersona): SelectItem {
        return {
            label: persona.name,
            value: persona
        };
    }

    private getLanguageFieldOption(language: DotLanguage): SelectItem {
        return {
            label: language.language,
            value: language
        };
    }

    private getDeviceFieldOption(device: DotDevice): SelectItem {
        return {
            label: device.label,
            value: device
        };
    }
}
