import {
    Component,
    ViewChild,
    Output,
    EventEmitter,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import { PaginatorService } from '@services/paginator';
import { SearchableDropdownComponent } from '@components/_common/searchable-dropdown/component';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotContentService } from '@services/dot-content/dot-content.service';

import { SiteService } from 'dotcms-js';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

export const defaultVisitorPersona = {
    archived: false,
    baseType: 'PERSONA',
    contentType: 'persona',
    folder: 'SYSTEM_FOLDER',
    hasTitleImage: false,
    host: 'SYSTEM_HOST',
    hostFolder: 'SYSTEM_HOST',
    hostName: 'System Host',
    identifier: '0',
    inode: '',
    keyTag: 'dot:persona',
    languageId: 1,
    live: false,
    locked: false,
    modDate: 0,
    modUser: 'system',
    modUserName: 'system user system user',
    name: 'Default Visitor',
    personalized: false,
    sortOrder: 0,
    stInode: 'c938b15f-bcb6-49ef-8651-14d455a97045',
    title: 'Default Visitor',
    titleImage: 'TITLE_IMAGE_NOT_FOUND',
    working: false
};

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
export class DotPersonaSelectorComponent implements OnInit, OnChanges, OnDestroy {
    @Input() pageId: string;
    @Input() value: DotPersona;

    @Output() selected: EventEmitter<DotPersona> = new EventEmitter();

    @ViewChild('searchableDropdown') searchableDropdown: SearchableDropdownComponent;

    newPersonaForm: FormGroup;
    fileName: string;
    totalRecords: number;
    paginationPerPage = 5;
    personas: DotPersona[];
    messagesKey: { [key: string]: string } = {};
    addAction: (item: DotPersona) => void;
    selected2: DotPersona;
    visible = true;
    dialogActions: DotDialogActions;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public paginationService: PaginatorService,
        public dotMessageService: DotMessageService,
        public dotContentService: DotContentService,
        private fb: FormBuilder,
        private siteService: SiteService
    ) {}

    ngOnChanges(_changes: SimpleChanges): void {
        this.value = this.value || {
            ...defaultVisitorPersona,
            name: this.messagesKey['modes.persona.no.persona']
        };
    }

    ngOnInit(): void {
        this.addAction = () => {
            this.initPersonaForm();
            this.visible = true;
        };
        this.paginationService.url = `v1/page/${this.pageId}/personas`;
        this.paginationService.paginationPerPage = this.paginationPerPage;

        this.dotMessageService
            .getMessages([
                'modes.persona.no.persona',
                'modes.persona.selector.title',
                'modes.persona.add.persona',
                'dot.common.choose',
                'dot.common.remove'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
                this.value = {
                    ...defaultVisitorPersona,
                    name: this.messagesKey['modes.persona.no.persona']
                };
                this.getPersonasList();
            });
        this.initPersonaForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onFileUpload(event: any) {
        console.log(event);
        const response = JSON.parse(event.xhr.response);
        this.fileName = event.files[0].name;
        this.newPersonaForm.get('photo').setValue(response.tempFiles[0].id);
    }

    removeFile(): void {
        this.fileName = null;
        this.newPersonaForm.get('photo').setValue('');
    }

    siteChange(site: any) {
        this.newPersonaForm.get('hostFolder').setValue(site.identifier);
    }

    setKeyTag(): void {
        this.newPersonaForm
            .get('keyTag')
            .setValue(_.camelCase(this.newPersonaForm.get('name').value));
    }

    savePersona(): void {
        if (this.newPersonaForm.valid) {
            this.dotContentService.create(this.newPersonaForm.value).subscribe(x => {
                this.getPersonasList();
                console.log(x);
            });
        }
    }

    /**
     * Call when the global search changed
     * @param string filter
     * @memberof DotPersonaSelectorComponent
     */
    handleFilterChange(filter: string): void {
        this.getPersonasList(filter);
    }

    /**
     * Call when the current page changed
     * @param any event
     * @memberof DotPersonaSelectorComponent
     */
    handlePageChange(event): void {
        this.getPersonasList(event.filter, event.first);
    }

    /**
     * Call to load a new page.
     * @param string [filter='']
     * @param number [offset=0]
     * @memberof DotPersonaSelectorComponent
     */
    getPersonasList(filter = '', offset = 0): void {
        // Set filter if undefined
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe((items: DotPersona[]) => {
            this.personas = items;
            this.totalRecords = this.totalRecords || this.paginationService.totalRecords;
        });
    }

    /**
     * Call when the selected persona changed and the change event is emmited
     * @param DotPersona persona
     * @memberof DotPersonaSelectorComponent
     */
    personaChange(persona: DotPersona): void {
        this.selected.emit(persona);
        this.searchableDropdown.toggleOverlayPanel();
    }

    /**
     * Call when the selected persona changed and the change event is emmited
     * @param DotPersona persona
     * @memberof DotPersonaSelectorComponent
     */
    deletePersonalization(_persona: DotPersona): void {
        // TODO: Confirm & call service
        this.searchableDropdown.toggleOverlayPanel();
    }

    private initPersonaForm(): void {
        this.newPersonaForm = this.fb.group({
            hostFolder: [this.siteService.currentSite.identifier, [Validators.required]],
            keyTag: [{ value: '', disabled: true }],
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
                    this.visible = false;
                }
            }
        };
    }
}
