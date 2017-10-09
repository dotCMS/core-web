import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { ContentType } from '../shared/content-type.model';
import { ContentTypesFormComponent } from '../form';
import { CrudService } from '../../../api/services/crud';
import { Field } from '../fields/index';
import { FieldService } from '../fields/service';
import { MessageService } from '../../../api/services/messages-service';

/**
 * Portlet component for edit content types
 *
 * @export
 * @class ContentTypesEditComponent
 * @extends {BaseComponent}
 */
@Component({
    selector: 'dot-content-types-edit',
    templateUrl: './content-types-edit.component.html'
})
export class ContentTypesEditComponent extends BaseComponent implements OnInit {
    @ViewChild('form') form: ContentTypesFormComponent;

    data$: Observable<ContentType>;
    fields: Field[];
    contentTypeId: string;

    constructor(
        messageService: MessageService,
        private crudService: CrudService,
        private fieldService: FieldService,
        private route: ActivatedRoute,
        public router: Router
    ) {
        super(
            [
                'Content-Type',
                'message.structure.cantdelete',

                'contenttypes.action.cancel',
                'contenttypes.action.delete',
                'contenttypes.confirm.message.delete',
                'contenttypes.confirm.message.delete.content',
                'contenttypes.confirm.message.delete.warning'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.data$ = this.route.data.pluck('contentType').map((contentType: ContentType) => {
            if (contentType.id) {
                this.contentTypeId = contentType.id;
            }
            if (contentType.fields) {
                this.fields = contentType.fields;
            }
            return contentType;
        });
    }

    /**
     * Combine data from the form and submit to update content types
     *
     * @param {any} $event
     *
     * @memberof ContentTypesEditComponent
     */
    handleFormSubmit($event): void {
        this.crudService
            .putData(`v1/contenttype/id/${this.contentTypeId}`, $event.value)
            .subscribe(() => {
                this.form.resetForm();
            });
    }

    /**
     * Remove fields
     * @param fieldsToDelete Fields to be removed
     */
    removeFields(fieldsToDelete: Field[]): void {
        this.fieldService
            .deleteFields(this.contentTypeId, fieldsToDelete)
            .pluck('fields')
            .subscribe((fields: Field[]) => {
                this.fields = fields;
            });
    }

    /**
     * Save fields
     * @param fieldsToSave Fields to be save
     */
    saveFields(fieldsToSave: Field[]): void {
        this.fieldService
            .saveFields(this.contentTypeId, fieldsToSave)
            .subscribe((fields: Field[]) => {
                this.fields = fields;
            });
    }
}
