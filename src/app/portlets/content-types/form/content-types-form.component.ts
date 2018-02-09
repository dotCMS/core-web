import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    ElementRef,
    ViewChild,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import * as _ from 'lodash';
import { DotcmsConfig } from 'dotcms-js/dotcms-js';
import { SelectItem } from 'primeng/primeng';

import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { SiteSelectorComponent } from '../../../view/components/_common/site-selector/site-selector.component';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';

// TODO: move this to models
import { Field } from '../fields';
import { WorkflowService } from '../../../api/services/workflow/workflow.service';
import { Workflow } from '../../../shared/models/workflow/workflow.model';
import { Observable } from 'rxjs/Observable';
import { DotRouterService } from '../../../api/services/dot-router-service';

/**
  * Form component to create or edit content types
  *
  * @export
  * @class ContentTypesFormComponent
  * @extends {BaseComponent}
  * @implements {OnInit}
  * @implements {OnChanges}
  * @implements {AfterViewInit}
  * @implements {OnDestroy}
  */
@Component({
    providers: [SiteSelectorComponent],
    selector: 'dot-content-types-form',
    styleUrls: ['./content-types-form.component.scss'],
    templateUrl: 'content-types-form.component.html'
})
export class ContentTypesFormComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('name') name: ElementRef;
    @ViewChild('formEl') formEl: HTMLFormElement;
    @Input() data: any;
    @Input() fields: Field[];
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();
    @Output() closeDialog: EventEmitter<any> = new EventEmitter();

    dateVarOptions: SelectItem[] = [];
    form: FormGroup;
    isButtonDisabled = true;
    placeholder: string;
    submitAttempt = false;
    templateInfo = {
        placeholder: '',
        action: ''
    };
    workflowOptions: Observable<SelectItem[]>;
    show = true;

    private originalValue: any;

    constructor(
        private dotcmsConfig: DotcmsConfig,
        private fb: FormBuilder,
        private contentTypesInfoService: ContentTypesInfoService,
        public dotMessageService: DotMessageService,
        private workflowService: WorkflowService,
        private dotRouterService: DotRouterService
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
                'contenttypes.action.create',
                'contenttypes.action.edit',
                'contenttypes.action.delete',
                'contenttypes.form.name.error.required',
                'contenttypes.action.form.cancel',
                'contenttypes.content.contenttype',
                'contenttypes.content.fileasset',
                'contenttypes.content.content',
                'contenttypes.content.form',
                'contenttypes.content.persona',
                'contenttypes.content.widget',
                'contenttypes.content.htmlpage',
                'contenttypes.content.key_value',
                'contenttypes.content.vanity_url'
            ],
            dotMessageService
        );
    }

    ngOnInit(): void {
        this.initFormGroup();
        this.initWorkflowField();
        this.bindActionButtonState();
        this.setTemplateInfo();
    }

    ngAfterViewInit() {
        if (!this.isEditMode()) {
            this.name.nativeElement.focus();
        }
    }

    ngOnChanges(changes): void {
        if (changes.fields && !changes.fields.firstChange) {
            this.setDateVarFieldsState();
        }
    }

    setTemplateInfo(): void {
        this.dotMessageService.messageMap$.subscribe(() => {
            const type = this.data.baseType.toLowerCase();

            this.templateInfo = {
                placeholder: `${this.dotMessageService.get(`contenttypes.content.${type}`)}
                              ${this.dotMessageService.get('contenttypes.form.name')} *`,
                action: this.isEditMode()
                    ? this.dotMessageService.get('contenttypes.action.update')
                    : this.dotMessageService.get('contenttypes.action.create')
            };
        });
    }

    /**
     * Cancel the editing of the the form and collapsed
     *
     * @memberof ContentTypesFormComponent
     */
    cancelForm(): void {
        if (this.isEditMode() && this.isFormValueUpdated()) {
            this.form.patchValue(this.originalValue);
        }

        this.isEditMode() ? this.closeDialog.emit() : this.dotRouterService.gotoPortlet('/content-types-angular');
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
        this.submitAttempt = false;
        this.originalValue = this.form.value;
        this.setButtonState();
    }

    /**
     * Set the variable property base on the name and sbmit the form if it's valid
     *
     * @memberof ContentTypesFormComponent
     */
    submitContent($event): void {
        console.log('submitContent');
        if (!this.submitAttempt) {
            this.submitAttempt = true;
        }

        if (this.form.valid) {
            this.templateInfo.placeholder = this.form.value.name;
            this.onSubmit.emit(this.form.value);
        }
    }

    /**
     * It submits the form from submit button
     * @memberof ContentTypesFormComponent
     */
    submitForm(): void {
        this.formEl.ngSubmit.emit();
    }

    private bindActionButtonState(): void {
        this.form.valueChanges.subscribe(() => {
            this.setButtonState();
        });
    }

    private setButtonState() {
        this.isButtonDisabled = this.isEditMode() ? !this.form.valid || !this.isFormValueUpdated() : !this.form.valid;
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
                value: ''
            });
        }

        return dateVarOptions;
    }

    private handleDateVarChange($event, field): void {
        const expireDateVar = this.form.get('expireDateVar');
        const publishDateVar = this.form.get('publishDateVar');

        if (field === 'publishDateVar' && expireDateVar.value === $event.value) {
            expireDateVar.patchValue('');
        }
        if (field === 'expireDateVar' && publishDateVar.value === $event.value) {
            publishDateVar.patchValue('');
        }
    }

    private initFormGroup(): void {
        this.form = this.fb.group({
            clazz: this.data.clazz || '',
            description: this.data.description || '',
            expireDateVar: [{ value: this.data.description || '', disabled: true }],
            host: this.data.host || '',
            name: [this.data.name || '', [Validators.required]],
            publishDateVar: [{ value: this.data.publishDateVar || '', disabled: true }],
            workflow: [
                { value: this.data.workflows ? this.data.workflows.map(workflow => workflow.id) : [], disabled: true }
            ],
            defaultType: this.data.defaultType,
            fixed: this.data.fixed,
            folder: this.data.folder,
            system: this.data.system
        });

        if (this.isBaseTypeContent()) {
            this.setBaseTypeContentSpecificFields();
        }

        if (this.isEditMode() && !this.originalValue) {
            this.originalValue = this.form.value;
        }

        if (this.fields && this.fields.length) {
            this.setDateVarFieldsState();
        }
    }

    private initWorkflowField(): void {
        this.dotcmsConfig
            .getConfig()
            .take(1)
            .subscribe(res => {
                this.updateWorkflowFormControl(res.license);
            });
    }

    private fillWorkflowFieldOptions(): void {
        this.workflowOptions = this.workflowService
            .get()
            .flatMap((workflows: Workflow[]) => workflows)
            .map((workflow: Workflow) => this.getWorkflowFieldOption(workflow))
            .toArray();
    }

    private getWorkflowFieldOption(workflow: Workflow): SelectItem {
        return {
            label: workflow.name,
            value: workflow.id
        };
    }

    private isBaseTypeContent(): boolean {
        return this.data && this.data.baseType === 'CONTENT';
    }

    private isDateVarField(field: Field): boolean {
        return field.clazz === 'com.dotcms.contenttype.model.field.ImmutableDateTimeField' && field.indexed;
    }

    private isFormValueUpdated(): boolean {
        return !_.isEqual(this.form.value, this.originalValue);
    }

    private isNewDateVarFields(newOptions: SelectItem[]): boolean {
        return this.dateVarOptions.length !== newOptions.length;
    }

    private setBaseTypeContentSpecificFields(): void {
        this.form.addControl('detailPage', new FormControl((this.data && this.data.detailPage) || ''));
        this.form.addControl('urlMapPattern', new FormControl((this.data && this.data.urlMapPattern) || ''));
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

            if (this.originalValue) {
                this.originalValue.publishDateVar = publishDateVar.value;
                this.originalValue.expireDateVar = expireDateVar.value;
            }
        } else {
            publishDateVar.disable();
            expireDateVar.disable();

            if (this.originalValue) {
                delete this.originalValue.publishDateVar;
                delete this.originalValue.expireDateVar;
            }
        }

        this.setButtonState();
    }

    private updateWorkflowFormControl(license): void {
        if (!license.isCommunity) {
            const workflowControl = this.form.get('workflow');
            this.fillWorkflowFieldOptions();
            workflowControl.enable();

            if (this.originalValue) {
                this.originalValue.workflow = workflowControl.value;
            }
            this.setButtonState();
        }
    }
}
