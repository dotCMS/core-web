import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, filter } from 'rxjs/operators';

import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';

import { DotMessageService } from '@services/dot-messages-service';
import { DotWorkflowService } from '@services/dot-workflow/dot-workflow.service';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import {
    DotCMSContentTypeField,
    DotCMSContentTypeLayoutRow,
    DotSystemActionType,
    DotWorkflow,
    DotCMSContentType,
    DotSystemActionMappings
} from 'dotcms-models';
import { FieldUtil } from '../fields/util/field-util';

/**
 * Form component to create or edit content types
 *
 * @export
 * @class ContentTypesFormComponent
 * @implements {OnInit}
 */
@Component({
    providers: [],
    selector: 'dot-content-types-form',
    styleUrls: ['./content-types-form.component.scss'],
    templateUrl: 'content-types-form.component.html'
})
export class ContentTypesFormComponent implements OnInit, OnDestroy {
    @ViewChild('name')
    name: ElementRef;

    @Input()
    data: DotCMSContentType;

    @Input()
    layout: DotCMSContentTypeLayoutRow[];

    @Output()
    onSubmit: EventEmitter<DotCMSContentType> = new EventEmitter();

    @Output()
    valid: EventEmitter<boolean> = new EventEmitter();

    canSave = false;
    dateVarOptions: SelectItem[] = [];
    form: FormGroup;
    nameFieldLabel: Observable<string>;
    workflowsSelected$: Observable<string[]>;

    private originalValue: DotCMSContentType;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        private dotWorkflowService: DotWorkflowService,
        private dotLicenseService: DotLicenseService,
        public dotMessageService: DotMessageService
    ) {
        dotMessageService
            .getMessages([
                'contenttypes.action.create',
                'contenttypes.action.delete',
                'contenttypes.action.edit',
                'contenttypes.action.form.cancel',
                'contenttypes.action.save',
                'contenttypes.action.update',
                'contenttypes.form.field.detail.page',
                'contenttypes.form.field.expire.date.field',
                'contenttypes.form.field.host_folder.label',
                'contenttypes.form.hint.error.only.default.scheme.available.in.Community',
                'contenttypes.form.identifier',
                'contenttypes.form.label.URL.pattern',
                'contenttypes.form.label.description',
                'contenttypes.form.label.publish.date.field',
                'contenttypes.form.label.workflow',
                'contenttypes.form.label.workflow.actions',
                'contenttypes.form.message.no.date.fields.defined',
                'contenttypes.form.name',
                'contenttypes.hint.URL.map.pattern.hint1',
                'dot.common.message.field.required'
            ])
            .pipe(take(1))
            .subscribe();
    }

    ngOnInit(): void {
        this.initFormGroup();
        this.initWorkflowField();
        this.bindActionButtonState();

        this.nameFieldLabel = this.setNameFieldLabel();
        this.name.nativeElement.focus();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Update expireDateVar and publishDateVar fields base on selection
     *
     * @param any $event
     * @param any field
     * @memberof ContentTypesFormComponent
     */
    handleDateVarChange($event, field): void {
        if (field === 'publishDateVar') {
            this.updateExpireDateVar($event.value);
        } else {
            this.updatePublishDateVar($event.value);
        }
    }

    /**
     * Check if the form is in edit mode
     *
     * @returns boolean
     * @memberof ContentTypesFormComponent
     */
    isEditMode(): boolean {
        return !!(this.data && this.data.id);
    }

    /**
     * If form is valid emit form submit event
     *
     * @memberof ContentTypesFormComponent
     */
    submitForm(): void {
        if (this.canSave) {
            this.onSubmit.emit(this.form.value);
        }
    }

    private setNameFieldLabel(): Observable<string> {
        return this.dotMessageService.messageMap$.pipe(
            map(() => {
                const type = this.data.baseType.toLowerCase();
                return `${this.dotMessageService.get(`contenttypes.content.${type}`)}
            ${this.dotMessageService.get('contenttypes.form.name')} *`;
            })
        );
    }

    private bindActionButtonState(): void {
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.setSaveState();
        });
    }

    private setSaveState() {
        this.canSave = this.isEditMode()
            ? this.form.valid && this.isFormValueUpdated()
            : this.form.valid;

        this.valid.next(this.canSave);
    }

    private getDateVarFieldOption(field: DotCMSContentTypeField): SelectItem {
        return {
            label: field.name,
            value: field.variable
        };
    }

    private getDateVarOptions(): SelectItem[] {
        const dateVarOptions = FieldUtil.getFieldsWithoutLayout(this.layout)
            .filter((field: DotCMSContentTypeField) => this.isDateVarField(field))
            .map((field: DotCMSContentTypeField) => this.getDateVarFieldOption(field));

        if (dateVarOptions.length) {
            dateVarOptions.unshift({
                label: '',
                value: ''
            });
        }

        return this.isNewDateVarFields(dateVarOptions) ? dateVarOptions : [];
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private initFormGroup(): void {
        this.form = this.fb.group({
            clazz: this.getProp(this.data.clazz),
            description: this.getProp(this.data.description),
            host: this.getProp(this.data.host),
            defaultType: this.data.defaultType,
            fixed: this.data.fixed,
            folder: this.data.folder,
            system: this.data.system,
            expireDateVar: [{ value: this.getProp(this.data.expireDateVar), disabled: true }],
            name: [this.getProp(this.data.name), [Validators.required]],
            publishDateVar: [{ value: this.getProp(this.data.publishDateVar), disabled: true }],
            workflows: [
                {
                    value: this.data.workflows || [],
                    disabled: true
                }
            ],
            systemActionMap: this.fb.group({
                [DotSystemActionType.NEW]: [
                    {
                        value: this.data.systemActionMappings
                            ? this.getActionIdentifier(this.data.systemActionMappings)
                            : '',
                        disabled: true
                    }
                ]
            })
        });

        this.setBaseTypeContentSpecificFields();
        this.setOriginalValue();
        this.setDateVarFieldsState();
        this.setSystemWorkflow();
        this.workflowsSelected$ = this.form.get('workflows').valueChanges;
    }

    private getActionIdentifier(actionMap: DotSystemActionMappings): string {
        if (Object.keys(actionMap).length) {
            const item = actionMap[DotSystemActionType.NEW];
            return typeof item !== 'string' ? item.identifier : '';
        }

        return '';
    }

    private getProp(item: string): string {
        return item || '';
    }

    private setSystemWorkflow(): void {
        if (!this.isEditMode()) {
            this.dotWorkflowService
                .getSystem()
                .pipe(take(1))
                .subscribe((workflow: DotWorkflow) => {
                    this.form.get('workflows').setValue([workflow]);
                });
        }
    }

    private setOriginalValue(): void {
        if (this.isEditMode() && !this.originalValue) {
            this.originalValue = this.form.value;
        }
    }

    private initWorkflowField(): void {
        this.dotLicenseService
            .isEnterprise()
            .pipe(
                take(1),
                filter((isEnterpriseLicense: boolean) => isEnterpriseLicense)
            )
            .subscribe(() => {
                this.enableWorkflowFormControls();
            });
    }

    private isBaseTypeContent(): boolean {
        return this.data && this.data.baseType === 'CONTENT';
    }

    private isDateVarField(field: DotCMSContentTypeField): boolean {
        return (
            field.clazz === 'com.dotcms.contenttype.model.field.ImmutableDateTimeField' &&
            field.indexed
        );
    }

    private isFormValueUpdated(): boolean {
        return !_.isEqual(this.form.value, this.originalValue);
    }

    private isNewDateVarFields(newOptions: SelectItem[]): boolean {
        return this.dateVarOptions.length !== newOptions.length;
    }

    private setBaseTypeContentSpecificFields(): void {
        if (this.isBaseTypeContent()) {
            this.form.addControl('detailPage', new FormControl(this.getProp(this.data.detailPage)));
            this.form.addControl(
                'urlMapPattern',
                new FormControl(this.getProp(this.data.urlMapPattern))
            );
        }
    }

    private setDateVarFieldsState(): void {
        if (this.isLayoutSet()) {
            this.dateVarOptions = this.getDateVarOptions();

            const publishDateVar = this.form.get('publishDateVar');
            const expireDateVar = this.form.get('expireDateVar');

            if (this.dateVarOptions.length) {
                publishDateVar.enable();
                expireDateVar.enable();

                if (this.originalValue) {
                    this.originalValue.publishDateVar = publishDateVar.value;
                    this.originalValue.expireDateVar = expireDateVar.value;
                }
            }

            this.setSaveState();
        }
    }

    private isLayoutSet(): boolean {
        return !!(this.layout && this.layout.length);
    }

    private enableWorkflowFormControls(): void {
        const workflowControl = this.form.get('workflows');
        const workflowActionControl = this.form.get('systemActionMap').get(DotSystemActionType.NEW);

        workflowControl.enable();
        workflowActionControl.enable();

        if (this.originalValue) {
            this.originalValue.workflows = workflowControl.value;
            this.originalValue.systemActionMappings = {};
            this.originalValue.systemActionMappings[DotSystemActionType.NEW] =
                workflowActionControl.value;
        }
        this.setSaveState();
    }

    private updateExpireDateVar(value: string): void {
        const expireDateVar = this.form.get('expireDateVar');

        if (expireDateVar.value === value) {
            expireDateVar.patchValue('');
        }
    }

    private updatePublishDateVar(value: string): void {
        const publishDateVar = this.form.get('publishDateVar');

        if (publishDateVar.value === value) {
            publishDateVar.patchValue('');
        }
    }
}
