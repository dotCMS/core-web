import { Component, Input, OnInit } from '@angular/core';
import { DotEditPageViewAs } from '@models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotLanguage } from '@models/dot-language/dot-language.model';
import { DotDevice } from '@models/dot-device/dot-device.model';
import { DotRenderedPageState } from '../../../shared/models/dot-rendered-page-state.model';
import { DotMessageService } from '@services/dot-messages-service';
import { Observable } from 'rxjs';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { DotPageStateService } from '../../services/dot-page-state/dot-page-state.service';

@Component({
    selector: 'dot-edit-page-view-as-controller',
    templateUrl: './dot-edit-page-view-as-controller.component.html',
    styleUrls: ['./dot-edit-page-view-as-controller.component.scss']
})
export class DotEditPageViewAsControllerComponent implements OnInit {
    isEnterpriseLicense$: Observable<boolean>;
    messages: { [key: string]: string } = {};

    private value: DotEditPageViewAs;
    private _pageState: DotRenderedPageState;

    constructor(
        private dotMessageService: DotMessageService,
        private dotLicenseService: DotLicenseService,
        private dotPageStateService: DotPageStateService
    ) {}

    ngOnInit(): void {
        this.isEnterpriseLicense$ = this.dotLicenseService.isEnterprise();
        this.dotMessageService
            .getMessages(['editpage.viewas.previewing'])
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
            });
    }

    @Input()
    set pageState(pageState: DotRenderedPageState) {
        this._pageState = pageState;
        this.value = pageState.viewAs;
    }

    get pageState(): DotRenderedPageState {
        return this._pageState;
    }

    /**
     * Handle the changes in Persona Selector.
     *
     * @param DotPersona persona
     * @memberof DotEditPageViewAsControllerComponent
     */
    changePersonaHandler(persona: DotPersona): void {
        this.value.persona = persona;
        this.dotPageStateService.setPersona(persona);
    }

    /**
     * Handle changes in Language Selector.
     *
     * @param DotLanguage language
     * @memberof DotEditPageViewAsControllerComponent
     */
    changeLanguageHandler({ id }: DotLanguage): void {
        this.value.language = id;
        this.dotPageStateService.setLanguage(id);
    }

    /**
     * Handle changes in Device Selector.
     *
     * @param DotDevice device
     * @memberof DotEditPageViewAsControllerComponent
     */
    changeDeviceHandler(device: DotDevice): void {
        this.value.device = device;
        this.dotPageStateService.setDevice(device);
    }
}
