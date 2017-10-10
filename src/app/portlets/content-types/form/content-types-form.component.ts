import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { DotcmsConfig } from 'dotcms-js/dotcms-js';
import { SelectItem } from 'primeng/primeng';

import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../api/services/messages-service';
import { SiteSelectorComponent } from '../../../view/components/_common/site-selector/site-selector.component';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';

// TODO: move this to models
import { Field } from '../fields';

/**
 * Form component to create or edit content types
 *
 * @export
 * @class ContentTypesFormComponent
 * @extends {BaseComponent}
 */
@Component({
    animations: [
        trigger('enterAnimation', [
            state(
                'expanded',
                style({
                    height: '*',
                    overflow: 'visible'
                })
            ),
            state(
                'collapsed',
                style({
                    height: '0px',
                    overflow: 'hidden'
                })
            ),
            transition('expanded <=> collapsed', animate('250ms ease-in-out'))
        ])
    ],
    providers: [SiteSelectorComponent],
    selector: 'dot-content-types-form',
    styleUrls: ['./content-types-form.component.scss'],
    templateUrl: 'content-types-form.component.html'
})
export class ContentTypesFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Input() fields: Field[];
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    dateVarOptions: SelectItem[] = [];
    form: FormGroup;
    formState = 'expanded';
    placeholder: string;
    submitAttempt = false;
    templateInfo = {
        icon: '',
        placeholder: '',
        action: ''
    };
    workflowOptions: SelectItem[] = [];

    constructor(
        private dotcmsConfig: DotcmsConfig,
        private fb: FormBuilder,
        private contentTypesInfoService: ContentTypesInfoService,
        public messageService: MessageService
    ) {
        super(
            [
                'contenttypes.form.field.detail.page',
                'contenttypes.form.field.expire.date.field',
                'contenttypes.form.field.host_folder.label',
                'contenttypes.form.identifier',
                'contenttypes.form.message.no.date.fields.defined',
                'contenttypes.form.label.publish.date.field',
                'contenttypes.hint.URL.map.pattern.hint1',
                'contenttypes.form.label.URL.pattern',
                'contenttypes.content.variable',
                'contenttypes.form.label.workflow',
                'contenttypes.form.hint.error.only.default.scheme.available.in.Community',
                'contenttypes.form.label.description',
                'contenttypes.form.name',
                'contenttypes.action.save',
                'contenttypes.action.update',
                'contenttypes.action.edit',
                'contenttypes.action.delete',
                'contenttypes.form.name.error.required',
                'contenttypes.action.form.cancel',
                'contenttypes.content.file',
                'contenttypes.content.content',
                'contenttypes.content.form',
                'contenttypes.content.persona',
                'contenttypes.content.widget',
                'contenttypes.content.page'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.initFormGroup();
        this.populateForm();
        this.initWorkflowtFieldOptions();
        this.setTemplateInfo();

        if (this.fields) {
            this.setDateVarFieldsState();
        }

        if (this.isEditMode()) {
            this.toggleForm();
        }

        if (this.isBaseTypeContent()) {
            this.setBaseTypeContentSpecificFields();
        }

        this.dotcmsConfig
            .getConfig()
            .take(1)
            .subscribe(this.updateFormControls.bind(this));
    }

    ngOnChanges(changes): void {
        if (changes.fields && !changes.fields.firstChange) {
            this.setDateVarFieldsState();
        }
    }

    /**
     * Check if the form is in edit mode
     *
     * @returns {boolean}
     * @memberof ContentTypesFormComponent
     */
    isEditMode(): boolean {
        return !!(this.data && this.data.id);
    }

    /**
     * Reset from to basic state
     *
     * @memberof ContentTypesFormComponent
     */
    resetForm(): void {
        this.formState = 'collapsed';
        this.submitAttempt = false;
    }

    /**
     * Set the icon, labels and placeholder in the template
     *
     * @memberof ContentTypesFormComponent
     */
    setTemplateInfo(): void {
        this.messageService.messageMap$.subscribe(() => {
            const type = this.data.baseType.toLowerCase();

            this.templateInfo = {
                icon: this.contentTypesInfoService.getIcon(type),
                placeholder: `${this.i18nMessages[`contenttypes.content.${type}`]} ${this
                    .i18nMessages['contenttypes.form.name']}`,
                action: this.isEditMode()
                    ? this.i18nMessages['contenttypes.action.update']
                    : this.i18nMessages['contenttypes.action.save']
            };
        });
    }

    /**
     * Set the variable property base on the name and sbmit the form if it's valid
     *
     * @memberof ContentTypesFormComponent
     */
    submitContent(): void {
        if (!this.submitAttempt) {
            this.submitAttempt = true;
        }

        if (this.form.valid) {
            this.onSubmit.emit(this.form.value);
        }
    }

    /**
     * Toggle the variable that expand or collapse the form
     *
     * @memberof ContentTypesFormComponent
     */
    toggleForm(): void {
        this.formState = this.formState === 'collapsed' ? 'expanded' : 'collapsed';
    }

    private getDateVarFieldOption(field: Field): SelectItem {
        return {
            label: field.name,
            value: field.variable
        };
    }

    private getDateVarOptions(): SelectItem[] {
        const dateVarOptions = this.fields
            .filter((field: Field) => this.isDateVarField(field))
            .map((field: Field) => this.getDateVarFieldOption(field));

        if (dateVarOptions.length) {
            dateVarOptions.unshift({
                label: '',
                value: null
            });
        }

        return dateVarOptions;
    }

    private handleDateVarChange($event, field): void {
        const expireDateVar = this.form.get('expireDateVar');
        const publishDateVar = this.form.get('publishDateVar');

        if (field === 'publishDateVar' && expireDateVar.value === $event.value) {
            expireDateVar.patchValue(null);
        }
        if (field === 'expireDateVar' && publishDateVar.value === $event.value) {
            publishDateVar.patchValue(null);
        }
    }

    private initFormGroup(): void {
        this.form = this.fb.group({
            clazz: '',
            description: '',
            expireDateVar: [{ value: '', disabled: true }],
            host: '',
            name: ['', [Validators.required]],
            publishDateVar: [{ value: '', disabled: true }],
            workflow: ''
        });
    }

    private initWorkflowtFieldOptions(): void {
        this.workflowOptions = [
            {
                label: 'Select Workflow',
                value: null
            }
        ];
    }

    private isBaseTypeContent(): boolean {
        return this.data && this.data.baseType === 'CONTENT';
    }

    private isDateVarField(field: Field): boolean {
        return (
            field.clazz === 'com.dotcms.contenttype.model.field.ImmutableDateTimeField' &&
            field.indexed
        );
    }

    private isNewDateVarFields(newOptions: SelectItem[]): boolean {
        return this.dateVarOptions.length !== newOptions.length;
    }

    private populateForm(): void {
        const formData: any = {
            clazz: this.data.clazz || '',
            description: this.data.description || '',
            expireDateVar: this.data.expireDateVar || '',
            host: this.data.host || '',
            name: this.data.name || '',
            publishDateVar: this.data.publishDateVar || '',
            workflow: this.data.workflow || ''
        };

        if (this.form.get('detailPage')) {
            formData.detailPage = this.data.detailPage || '';
        }

        if (this.form.get('urlMapPattern')) {
            formData.urlMapPattern = this.data.urlMapPattern || '';
        }

        this.form.setValue(formData);
    }

    private setBaseTypeContentSpecificFields(): void {
        this.form.addControl(
            'detailPage',
            new FormControl((this.data && this.data.detailPage) || '')
        );
        this.form.addControl(
            'urlMapPattern',
            new FormControl((this.data && this.data.urlMapPattern) || '')
        );
    }

    private setDateVarFieldsState(): void {
        const dateVarNewOptions = this.getDateVarOptions();

        if (this.isNewDateVarFields(dateVarNewOptions)) {
            this.dateVarOptions = dateVarNewOptions;
        }

        const publishDateVar = this.form.get('publishDateVar');
        const expireDateVar = this.form.get('expireDateVar');

        if (this.dateVarOptions.length) {
            publishDateVar.enable();
            expireDateVar.enable();
        } else {
            publishDateVar.disable();
            expireDateVar.disable();
            publishDateVar.patchValue(null);
            expireDateVar.patchValue(null);
        }
    }

    private updateFormControls(res): void {
        if (res.license.isCommunity) {
            this.form.get('workflow').disable();
        }
    }
}
