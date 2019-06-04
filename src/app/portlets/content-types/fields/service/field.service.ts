import { pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DotContentTypeField, FieldType, DotFieldDivider } from '../shared';
import { CoreWebService } from 'dotcms-js';
import { RequestMethod } from '@angular/http';
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
     * @param DotContentTypeField[] fields fields to add
     * @returns Observable<any>
     * @memberof FieldService
     */
    saveFields(contentTypeId: string, fields: DotFieldDivider[]): Observable<DotFieldDivider[]> {

        return this.coreWebService
            .requestView({
                body: {
                    layout: fields
                },
                method: RequestMethod.Put,
                url: `v3/contenttype/${contentTypeId}/fields/move`
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
        fields: DotContentTypeField[]
    ): Observable<{ fields: DotFieldDivider[]; deletedIds: string[] }> {
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

    updateField(contentTypeId: string, field: DotContentTypeField): Observable<DotFieldDivider[]> {
        return this.coreWebService
            .requestView({
                body: {
                    field: field
                },
                method: RequestMethod.Put,
                url: `v3/contenttype/${contentTypeId}/fields/${field.id}`
            })
            .pipe(pluck('entity'));
    }
}
