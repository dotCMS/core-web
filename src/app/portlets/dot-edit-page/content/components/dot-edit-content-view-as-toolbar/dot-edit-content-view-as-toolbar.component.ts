import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { DotEditPageViewAs } from '../../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotPersona } from '../../../../../shared/models/dot-persona/dot-persona.model';
import { DotLanguage } from '../../../../../shared/models/dot-language/dot-language.model';
import { DotDevice } from '../../../../../shared/models/dot-device/dot-device.model';
import { DotRenderedPageState } from '../../../shared/models/dot-rendered-page-state.model';
import { PageMode } from '../../../shared/models/page-mode.enum';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-edit-content-view-as-toolbar',
    templateUrl: './dot-edit-content-view-as-toolbar.component.html',
    styleUrls: ['./dot-edit-content-view-as-toolbar.component.scss']
})
export class DotEditContentViewAsToolbarComponent implements OnInit, OnChanges {
    @Output() changeViewAs = new EventEmitter<DotEditPageViewAs>();

    isPreview: boolean;
    whatsChangedMessage: Observable<string>;

    private value: DotEditPageViewAs;
    private _pageState: DotRenderedPageState;

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit(): void {
        this.whatsChangedMessage = this.dotMessageService.getMessages(['common.whats.changed']).map((messages: string[]) => messages[0]);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pageState: DotRenderedPageState = changes.pageState.currentValue || {};
        this.isPreview = pageState.state.mode === PageMode.PREVIEW;
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
     * @param {DotPersona} persona
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changePersonaHandler(persona: DotPersona): void {
        this.value.persona = persona;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Handle changes in Language Selector.
     *
     * @param {DotLanguage} language
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeLanguageHandler(language: DotLanguage): void {
        this.value.language = language;
        this.changeViewAs.emit(this.value);
    }

    /**
     * Handle changes in Device Selector.
     *
     * @param {DotDevice} device
     * @memberof DotEditContentViewAsToolbarComponent
     */
    changeDeviceHandler(device: DotDevice): void {
        this.value.device = device;
        this.changeViewAs.emit(this.value);
    }
}
