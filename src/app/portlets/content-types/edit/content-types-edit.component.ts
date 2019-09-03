import { take, mergeMap, pluck, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import {
    DotCMSContentType,
    DotCMSContentTypeField,
    DotCMSContentTypeLayoutRow,
    DotCMSWorkflow
} from 'dotcms-models';
import { ContentTypesFormComponent } from '../form';
import { DotCrudService } from '@services/dot-crud';
import { ContentTypeFieldsDropZoneComponent } from '../fields/index';
import { FieldService } from '../fields/service';
import { DotMessageService } from '@services/dot-messages-service';
import { DotContentTypesInfoService } from '@services/dot-content-types-info';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import {
    DotHttpErrorManagerService,
    DotHttpErrorHandled
} from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { ResponseView } from 'dotcms-js';

import { DotEventsService } from '@services/dot-events/dot-events.service';
import { MenuItem } from 'primeng/primeng';
import { Subject } from 'rxjs';
import { DotEditContentTypeCacheService } from '../fields/content-type-fields-properties-form/field-properties/dot-relationships-property/services/dot-edit-content-type-cache.service';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';

/**
 * Portlet component for edit content types
 *
 * @export
 * @class ContentTypesEditComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-content-types-edit',
    templateUrl: './content-types-edit.component.html',
    styleUrls: ['./content-types-edit.component.scss']
})
export class ContentTypesEditComponent implements OnInit, OnDestroy {
    @ViewChild('form')
    contentTypesForm: ContentTypesFormComponent;

    @ViewChild('fieldsDropZone')
    fieldsDropZone: ContentTypeFieldsDropZoneComponent;

    contentTypeActions: MenuItem[];
    dialogCloseable = false;
    data: DotCMSContentType;
    dialogActions: DotDialogActions;
    layout: DotCMSContentTypeLayoutRow[];
    messagesKey: { [key: string]: string } = {};
    show: boolean;
    templateInfo = {
        icon: '',
        header: ''
    };

    loadingFields = false;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private contentTypesInfoService: DotContentTypesInfoService,
        private crudService: DotCrudService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotEventsService: DotEventsService,
        private dotRouterService: DotRouterService,
        private fieldService: FieldService,
        private route: ActivatedRoute,
        public dotMessageService: DotMessageService,
        public router: Router,
        private dotEditContentTypeCacheService: DotEditContentTypeCacheService
    ) {}

    ngOnInit(): void {
        this.route.data
            .pipe(
                pluck('contentType'),
                takeUntil(this.destroy$)
            )
            .subscribe((contentType: DotCMSContentType) => {
                this.data = contentType;
                this.dotEditContentTypeCacheService.set(contentType);
                this.layout = contentType.layout;
            });

        this.dotMessageService
            .getMessages([
                'contenttypes.action.create',
                'contenttypes.action.edit',
                'contenttypes.action.update',
                'contenttypes.content.content',
                'contenttypes.content.create.contenttype',
                'contenttypes.content.edit.contenttype',
                'contenttypes.content.fileasset',
                'contenttypes.content.form',
                'contenttypes.content.htmlpage',
                'contenttypes.content.key_value',
                'contenttypes.content.persona',
                'contenttypes.content.vanity_url',
                'contenttypes.content.variable',
                'contenttypes.content.widget',
                'contenttypes.form.identifier',
                'contenttypes.dropzone.rows.add',
                'contenttypes.dropzone.rows.tab_divider'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;

                this.contentTypeActions = [
                    {
                        label: this.messagesKey['contenttypes.dropzone.rows.add'],
                        command: () => this.notifyAddEvt('add-row')
                    },
                    {
                        label: this.messagesKey['contenttypes.dropzone.rows.tab_divider'],
                        command: () => this.notifyAddEvt('add-tab-divider')
                    }
                ];

                if (!this.isEditMode()) {
                    this.startFormDialog();
                }

                this.dialogCloseable = this.isEditMode();
            });

        this.setTemplateInfo();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle hide dialog
     *
     * @memberof ContentTypesEditComponent
     */
    onDialogHide(): void {
        if (!this.isEditMode()) {
            this.dotRouterService.gotoPortlet('/content-types-angular');
        }
    }

    /**
     * Show and set options for dialog
     *
     * @memberof ContentTypesEditComponent
     */
    startFormDialog(): void {
        this.show = true;
        this.setEditContentletDialogOptions(this.messagesKey);
    }

    /**
     * Set the icon, labels and placeholder in the template
     * @memberof ContentTypesEditComponent
     */
    setTemplateInfo(): void {
        this.dotMessageService.messageMap$.pipe(take(1)).subscribe(() => {
            const type = this.contentTypesInfoService.getLabel(this.data.baseType);
            const contentTypeName = this.messagesKey[`contenttypes.content.${type}`];

            this.templateInfo = {
                icon: this.contentTypesInfoService.getIcon(type),
                header: this.isEditMode()
                    ? this.dotMessageService.get(
                          'contenttypes.content.edit.contenttype',
                          contentTypeName
                      )
                    : this.dotMessageService.get(
                          'contenttypes.content.create.contenttype',
                          contentTypeName
                      )
            };
        });
    }

    /**
     * Set the state for the ok action for the dialog
     *
     * @param {boolean} $event
     * @memberof ContentTypesEditComponent
     */
    setDialogOkButtonState(formIsValid: boolean): void {
        this.dialogActions = {
            ...this.dialogActions,
            accept: {
                ...this.dialogActions.accept,
                disabled: !formIsValid
            }
        };
    }

    /**
     * Check if we need to update or create a content type
     *
     * @param {DotCMSContentType} value
     * @memberof ContentTypesEditComponent
     */
    handleFormSubmit(value: DotCMSContentType): void {
        this.isEditMode() ? this.updateContentType(value) : this.createContentType(value);
    }

    /**
     * Check if the component is in edit mode
     *
     * @returns boolean
     * @memberof ContentTypesEditComponent
     */
    isEditMode(): boolean {
        return !!(this.data && this.data.id);
    }

    /**
     * Remove fields from the content type
     * @param DotContentTypeField[] fieldsToDelete Fields to be removed
     * @memberof ContentTypesEditComponent
     */
    removeFields(fieldsToDelete: DotCMSContentTypeField[]): void {
        this.fieldService
            .deleteFields(this.data.id, fieldsToDelete)
            .pipe(
                pluck('fields'),
                take(1)
            )
            .subscribe(
                (fields: DotCMSContentTypeLayoutRow[]) => {
                    this.layout = fields;
                },
                (err: ResponseView) => {
                    this.dotHttpErrorManagerService
                        .handle(err)
                        .pipe(take(1))
                        .subscribe(() => {});
                }
            );
    }

    /**
     * Save fields to the content type
     * @param layout layout to be save
     * @memberof ContentTypesEditComponent
     */
    saveFields(layout: DotCMSContentTypeLayoutRow[]): void {
        this.loadingFields = true;
        this.fieldService
            .saveFields(this.data.id, layout)
            .pipe(take(1))
            .subscribe(
                (fields: DotCMSContentTypeLayoutRow[]) => {
                    this.layout = fields;
                    this.loadingFields = false;
                },
                (err: ResponseView) => {
                    this.dotHttpErrorManagerService
                        .handle(err)
                        .pipe(take(1))
                        .subscribe(() => {
                            this.fieldsDropZone.cancelLastDragAndDrop();
                            this.loadingFields = false;
                        });
                }
            );
    }

    /**
     * Edit the properties of a field
     *
     * @param {DotCMSContentTypeField} fieldsToEdit field to be edit
     * @memberof ContentTypesEditComponent
     */
    editField(fieldsToEdit: DotCMSContentTypeField): void {
        this.loadingFields = true;
        this.fieldService
            .updateField(this.data.id, fieldsToEdit)
            .pipe(take(1))
            .subscribe(
                () => {
                    this.loadingFields = false;
                },
                (err: ResponseView) => {
                    this.dotHttpErrorManagerService
                        .handle(err)
                        .pipe(take(1))
                        .subscribe(() => {
                            this.fieldsDropZone.cancelLastDragAndDrop();
                            this.loadingFields = false;
                        });
                }
            );
    }

    /**
     * Send a notification of Add Row event to be handle elsewhere
     *
     * @memberof ContentTypesEditComponent
     */
    notifyAddEvt(typeEvt: string): void {
        this.dotEventsService.notify(typeEvt);
    }

    private setEditContentletDialogOptions(messages: { [key: string]: string }): void {
        this.dialogActions = {
            accept: {
                disabled: true,
                label: this.isEditMode()
                    ? messages['contenttypes.action.update']
                    : messages['contenttypes.action.create'],
                action: () => {
                    this.contentTypesForm.submitForm();
                }
            },
            cancel: {
                label: 'Cancel'
            }
        };
    }

    private createContentType(value: DotCMSContentType): void {
        const createdContentType = this.cleanUpFormValue({
            ...value
        });

        this.crudService
            .postData('v1/contenttype', createdContentType)
            .pipe(
                mergeMap((contentTypes: DotCMSContentType[]) => contentTypes),
                take(1)
            )
            .subscribe(
                (contentType: DotCMSContentType) => {
                    this.data = contentType;
                    this.layout = this.data.layout;
                    this.dotRouterService.goToEditContentType(this.data.id);
                    this.show = false;
                },
                (err: ResponseView) => {
                    this.handleHttpError(err);
                }
            );
    }

    private handleHttpError(err: ResponseView) {
        this.dotHttpErrorManagerService
            .handle(err)
            .pipe(take(1))
            .subscribe((_handled: DotHttpErrorHandled) => {
                this.dotRouterService.gotoPortlet('/content-types-angular');
            });
    }

    private updateContentType(value: DotCMSContentType): void {
        const updatedContentType = this.cleanUpFormValue({
            ...value,
            id: this.data.id
        });

        this.crudService
            .putData(`v1/contenttype/id/${this.data.id}`, updatedContentType)
            .pipe(take(1))
            .subscribe(
                (contentType: DotCMSContentType) => {
                    this.data = contentType;
                    this.show = false;
                },
                (err: ResponseView) => {
                    this.handleHttpError(err);
                }
            );
    }

    // The Content Types endpoint returns workflows (plural) but receive workflow (singular)
    private cleanUpFormValue(value: DotCMSContentType): { [key: string]: any } {
        if (value.workflows) {
            value['workflow'] = this.getWorkflowsIds(value.workflows);
            delete value.workflows;
        }

        return value;
    }

    private getWorkflowsIds(workflows: DotCMSWorkflow[]): string[] {
        return workflows.map((workflow: DotCMSWorkflow) => workflow.id);
    }
}
