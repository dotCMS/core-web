import {
    Component,
    ViewChild,
    Output,
    EventEmitter,
    Input,
    OnInit,
    OnDestroy
} from '@angular/core';
import { PaginatorService } from '@services/paginator';
import {
    SearchableDropdownComponent,
    PaginationEvent
} from '@components/_common/searchable-dropdown/component';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';
import { take, takeUntil } from 'rxjs/operators';
import { DotRenderedPageState, DotPageMode } from '@portlets/dot-edit-page/shared/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { Subject } from 'rxjs';
import { DotContentService } from '@services/dot-content/dot-content.service';
import { Site, SiteService } from 'dotcms-js';
import * as _ from 'lodash';
import { DotMessageService } from '@services/dot-messages-service';

/**
 * It is dropdown of personas, it handle pagination and global search
 *
 * @export
 * @class DotPersonaSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-persona-selector',
    styleUrls: ['./dot-persona-selector.component.scss'],
    templateUrl: 'dot-persona-selector.component.html'
})
export class DotPersonaSelectorComponent implements OnInit, OnDestroy {
    @Output() selected: EventEmitter<DotPersona> = new EventEmitter();

    @Output() delete: EventEmitter<DotPersona> = new EventEmitter();

    @ViewChild('searchableDropdown') searchableDropdown: SearchableDropdownComponent;

    isEditMode = false;
    messagesKey: { [key: string]: string } = {};
    paginationPerPage = 5;
    personas: DotPersona[];
    totalRecords: number;
    value: DotPersona;
    addAction: (item: DotPersona) => void;

    newPersonaForm: FormGroup;
    newPersonaImage: string;
    addDialogVisible = false;
    dialogActions: DotDialogActions;

    private destroy$: Subject<boolean> = new Subject<boolean>();
    private _pageState: DotRenderedPageState;

    constructor(
        public paginationService: PaginatorService,
        public dotMessageService: DotMessageService,
        public dotContentService: DotContentService,
        private fb: FormBuilder,
        private siteService: SiteService
    ) {}

    ngOnInit(): void {
        this.addAction = () => {
            this.initPersonaForm();
            this.searchableDropdown.toggleOverlayPanel();
            this.addDialogVisible = true;
        };
        this.paginationService.paginationPerPage = this.paginationPerPage;
        this.dotMessageService
            .getMessages(['modes.persona.add.persona', 'dot.common.choose', 'dot.common.remove'])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
        this.initPersonaForm();
    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onFileUpload(event: any) {
        const response = JSON.parse(event.xhr.response);
        this.newPersonaImage = event.files[0].name;
        this.newPersonaForm.get('photo').setValue(response.tempFiles[0].id);
    }

    removeFile(): void {
        this.newPersonaImage = null;
        this.newPersonaForm.get('photo').setValue('');
    }

    siteChange(site: Site) {
        this.newPersonaForm.get('hostFolder').setValue(site.identifier);
    }

    setKeyTag(): void {
        this.newPersonaForm
            .get('keyTag')
            .setValue(_.camelCase(this.newPersonaForm.get('name').value));
    }

    savePersona(): void {
        if (this.newPersonaForm.valid) {
            this.dotContentService
                .create(this.newPersonaForm.getRawValue())
                .subscribe((persona: DotPersona) => {
                    this.getPersonasList();
                    this.personaChange(persona);
                    this.addDialogVisible = false;
                });
        }
    }

    @Input('pageState')
    set pageState(value: DotRenderedPageState) {
        this._pageState = value;
        this.paginationService.url = `v1/page/${this.pageState.page.identifier}/personas`;
        this.isEditMode = this.pageState.state.mode === DotPageMode.EDIT;
        this.value = this.pageState.viewAs && this.pageState.viewAs.persona;
        this.reloadPersonasListCurrentPage();
    }

    get pageState(): DotRenderedPageState {
        return this._pageState;
    }

    /**
     * Call when the global search changed
     *
     * @param {string} filter
     * @memberof DotPersonaSelectorComponent
     */
    handleFilterChange(filter: string): void {
        this.getPersonasList(filter);
    }

    /**
     * Call when the current page changed
     *
     * @param {PaginationEvent} event
     * @memberof DotPersonaSelectorComponent
     */
    handlePageChange(event: PaginationEvent): void {
        this.getPersonasList(event.filter, event.first);
    }

    /**
     * Call when the selected persona changed and the change event is emmited
     *
     * @param {DotPersona} persona
     * @memberof DotPersonaSelectorComponent
     */
    personaChange(persona: DotPersona): void {
        if (!this.value || this.value.identifier !== persona.identifier) {
            this.selected.emit(persona);
        }
        this.searchableDropdown.toggleOverlayPanel();
    }

    /**
     * Refresh the current page in the persona list option
     *
     * @memberof DotPersonaSelectorComponent
     */
    reloadPersonasListCurrentPage(): void {
        this.paginationService
            .getCurrentPage()
            .pipe(take(1))
            .subscribe(this.setList.bind(this));
    }

    /**
     * Replace the persona receive in the current page list of personas
     *
     * @param {DotPersona} persona
     * @memberof DotPersonaSelectorComponent
     */
    updatePersonaInCurrentList(persona: DotPersona): void {
        this.personas = this.personas.map((currentPersona: DotPersona) => {
            return currentPersona.identifier === persona.identifier ? persona : currentPersona;
        });
    }

    private getPersonasList(filter = '', offset = 0): void {
        // Set filter if undefined
        this.paginationService.filter = filter;
        this.paginationService
            .getWithOffset(offset)
            .pipe(take(1))
            .subscribe(this.setList.bind(this));
    }

    private setList(items: DotPersona[]): void {
        this.personas = items;
        this.totalRecords = this.totalRecords || this.paginationService.totalRecords;
    }

    private initPersonaForm(): void {
        this.newPersonaImage = null;
        this.newPersonaForm = this.fb.group({
            hostFolder: [this.siteService.currentSite.identifier, [Validators.required]],
            keyTag: [{ value: '', disabled: true }, [Validators.required]],
            name: ['', [Validators.required]],
            photo: ['', [Validators.required]],
            contentType: 'persona'
        });

        this.newPersonaForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dialogActions = {
                ...this.dialogActions,
                accept: {
                    ...this.dialogActions.accept,
                    disabled: !this.newPersonaForm.valid
                }
            };
        });

        this.dialogActions = {
            accept: {
                action: () => {
                    this.savePersona();
                },
                label: 'accept',
                disabled: !this.newPersonaForm.valid
            },
            cancel: {
                label: 'cancel',
                action: () => {
                    this.addDialogVisible = false;
                }
            }
        };
    }
}
