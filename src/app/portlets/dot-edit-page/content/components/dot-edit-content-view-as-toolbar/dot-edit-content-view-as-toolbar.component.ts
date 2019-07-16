import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit
} from '@angular/core';
import { DotEditPageViewAs } from '@models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotLanguage } from '@models/dot-language/dot-language.model';
import { DotDevice } from '@models/dot-device/dot-device.model';
import { DotRenderedPageState } from '../../../shared/models/dot-rendered-page-state.model';
import { DotMessageService } from '@services/dot-messages-service';
import { Observable } from 'rxjs';
import { DotLicenseService } from '@services/dot-license/dot-license.service';

@Component({
    selector: 'dot-edit-content-view-as-toolbar',
    templateUrl: './dot-edit-content-view-as-toolbar.component.html',
    styleUrls: ['./dot-edit-content-view-as-toolbar.component.scss']
})
export class DotEditContentViewAsToolbarComponent implements OnInit {
    @Output()
    changeViewAs = new EventEmitter<DotEditPageViewAs>();

    isEnterpriseLicense$: Observable<boolean>;
    messages: { [key: string]: string } = {};

    private value: DotEditPageViewAs;
    private _pageState: DotRenderedPageState;

    constructor(
        private dotMessageService: DotMessageService,
        private dotLicenseService: DotLicenseService
    ) {}

    ngOnInit(): void {
        console.log('---pageState.viewAs.persona', this.pageState.viewAs.persona)
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
        console.log('---', pageState)
        this.value = pageState.viewAs;
    }

    get pageState(): DotRenderedPageState {
        return this._pageState;
    }

    /**
     * Handle the changes in Persona Selector.
     *
     * @param DotPersona persona
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changePersonaHandler(persona: DotPersona): void {
        this.value.persona = persona;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Handle changes in Language Selector.
     *
     * @param DotLanguage language
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeLanguageHandler(language: DotLanguage): void {
        this.value.language = language;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Handle changes in Device Selector.
     *
     * @param DotDevice device
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeDeviceHandler(device: DotDevice): void {
        this.value.device = device;
        this.changeViewAs.emit(this.value);
    }
}
