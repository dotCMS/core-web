import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { ContentType } from '../shared/content-type.model';
import { ContentTypesFormComponent } from '../form';
import { CrudService } from '../../../api/services/crud';
import { Field } from '../fields/index';
import { FieldService } from '../fields/service';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { DotRouterService } from '../../../api/services/dot-router-service';

/**
 * Portlet component for edit content types
 *
 * @export
 * @class ContentTypesEditComponent
 * @extends {BaseComponent}
 */
@Component({
    selector: 'dot-content-types-edit',
    templateUrl: './content-types-edit.component.html',
    styleUrls: ['./content-types-edit.component.scss']
})
export class ContentTypesEditComponent implements OnInit {
    @ViewChild('form') form: ContentTypesFormComponent;

    data: ContentType;
    fields: Field[];
    show = true;
    templateInfo = {
        icon: '',
        header: ''
    };
    dialogHeight = null;

    constructor(
        private crudService: CrudService,
        private fieldService: FieldService,
        private location: Location,
        private route: ActivatedRoute,
        public router: Router,
        public dotMessageService: DotMessageService,
        private contentTypesInfoService: ContentTypesInfoService,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit(): void {
        this.route.data.pluck('contentType').subscribe((contentType: ContentType) => {
            this.data = contentType;
            if (contentType.fields) {
                this.fields = contentType.fields;
            }
        });

        this.dotMessageService.getMessages([
            'contenttypes.action.form.cancel',
            'contenttypes.action.edit',
            'contenttypes.action.create',
            'contenttypes.action.update',
            'contenttypes.content.variable',
            'contenttypes.content.edit.contenttype',
            'contenttypes.content.create.contenttype',
            'contenttypes.form.identifier'

        ]).subscribe();

        this.setTemplateInfo();
        this.dialogHeight = window.innerHeight - 50;
    }

    /**
     * Set the icon, labels and placeholder in the template
     * @memberof ContentTypesEditComponent
     */
    setTemplateInfo(): void {
        this.dotMessageService.messageMap$.subscribe(() => {
            const type = this.data.baseType.toLowerCase();

            this.templateInfo = {
                icon: this.contentTypesInfoService.getIcon(type),
                header: this.isEditMode()
                    ? this.dotMessageService.get('contenttypes.content.edit.contenttype')
                    : this.dotMessageService.get('contenttypes.content.create.contenttype')
            };
        });
    }

    /**
     * Set the form in edit mode, expand it and focus the first field
     * @memberof ContentTypesEditComponent
     */
    editForm(): void {
        this.show = true;
    }

    /**
     * Close the dialog if is edit mode
     * @memberof ContentTypesEditComponent
     */
    closeDialog(): void {
        this.isEditMode() ? this.show = false : this.dotRouterService.gotoPortlet('/content-types-angular');
    }

    /**
     * Check if we need to update or create a content type
     *
     * @param {*} value;
     * @memberof ContentTypesEditComponent
     */
    handleFormSubmit(value: any): void {
        this.show = false;
        this.isEditMode() ? this.updateContentType(value) : this.createContentType(value);
    }

    /**
     * Check if the component is in edit mode
     *
     * @returns {boolean}
     * @memberof ContentTypesEditComponent
     */
    isEditMode(): boolean {
        return !!(this.data && this.data.id);
    }

    /**
     * Remove fields from the content type
     * @param fieldsToDelete Fields to be removed
     */
    removeFields(fieldsToDelete: Field[]): void {
        this.fieldService
            .deleteFields(this.data.id, fieldsToDelete)
            .pluck('fields')
            .subscribe((fields: Field[]) => {
                this.fields = fields;
            });
    }

    /**
     * Save fields to the content type
     * @param fieldsToSave Fields to be save
     */
    saveFields(fieldsToSave: Field[]): void {
        this.fieldService.saveFields(this.data.id, fieldsToSave).subscribe((fields: Field[]) => {
            this.fields = fields;
        });
    }

    private createContentType(value: ContentType): void {
        this.crudService
            .postData('v1/contenttype', value)
            .flatMap((contentTypes: ContentType[]) => contentTypes)
            .take(1)
            .subscribe((contentType: ContentType) => {
                this.data = contentType;
                this.fields = this.data.fields;
                this.form.resetForm();
                this.location.replaceState(`/content-types-angular/edit/${this.data.id}`);
            });
    }

    private updateContentType(value: any): void {
        const data = Object.assign({}, value, { id: this.data.id });

        this.crudService.putData(`v1/contenttype/id/${this.data.id}`, data).subscribe((contentType: ContentType) => {
            this.data = contentType;
            this.form.resetForm();
        });
    }
}
