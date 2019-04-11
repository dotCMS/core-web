import { pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentTypeField, FieldType, FieldDivider } from '../shared';
import { CoreWebService } from 'dotcms-js';
import { RequestMethod } from '@angular/http';
import { FieldUtil } from '../util/field-util';
import { FIELD_ICONS } from '../content-types-fields-list/content-types-fields-icon-map';

/**
 * Provide method to handle with the Field Types
 */
@Injectable()
export class FieldService {
    constructor(private coreWebService: CoreWebService) {}

    loadFieldTypes(): Observable<FieldType[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v1/fieldTypes'
            })
            .pipe(pluck('entity'));
    }

    /**
     * Save fields.
     * @param string contentTypeId Content Type'id
     * @param ContentTypeField[] fields fields to add
     * @returns Observable<any>
     * @memberof FieldService
     */
    saveFields(contentTypeId: string, fields: ContentTypeField[]): Observable<FieldDivider[]> {
        fields.forEach((field, index) => {
            field.contentTypeId = contentTypeId;

            if (FieldUtil.isRowOrColumn(field)) {
                field.name = `fields-${index}`;
            }

            if (field.dataType === '') {
                delete field.dataType;
            }
        });

        return this.coreWebService
            .requestView({
                body: {
                    fields: fields
                },
                method: RequestMethod.Put,
                url: `v3/contenttype/${contentTypeId}/fields`
            })
            .pipe(pluck('entity'));
    }

    /**
     * Delete fields
     * @param contentTypeId content types's id that contains the fields
     * @param fields Fields to delete
     */
    deleteFields(
        contentTypeId: string,
        fields: ContentTypeField[]
    ): Observable<{ fields: FieldDivider[]; deletedIds: string[] }> {
        return this.coreWebService
            .requestView({
                body: {
                    fieldsID: fields.map((field) => field.id)
                },
                method: RequestMethod.Delete,
                url: `v3/contenttype/${contentTypeId}/fields`
            })
            .pipe(pluck('entity'));
    }

    /**
     * Get Field icon by field's class
     * @param fieldClazz
     */
    getIcon(fieldClazz: string): string {
        return FIELD_ICONS[fieldClazz];
    }
}
