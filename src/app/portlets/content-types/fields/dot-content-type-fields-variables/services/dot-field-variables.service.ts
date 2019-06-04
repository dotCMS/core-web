import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreWebService } from 'dotcms-js';
import { RequestMethod } from '@angular/http';
import { pluck } from 'rxjs/operators';
import { DotFieldVariable } from '../models/dot-field-variable.interface';
import { DotContentTypeField } from '../../shared';

/**
 * Provide method to handle with the Field Variables
 */
@Injectable()
export class DotFieldVariablesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Load Field Variables.
     * @param {FieldVariableParams} params Variable params to get id of variables to be listed
     * @returns {Observable<DotFieldVariable[]>}
     * @memberof FieldVariablesService
     */
    load(field: DotContentTypeField): Observable<DotFieldVariable[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/contenttype/${field.contentTypeId}/fields/id/${field.id}/variables`
            })
            .pipe(pluck('entity'));
    }

    /**
     * Save Field Variables.
     * @param {FieldVariableParams} params Variable params to be saved
     * @returns {Observable<DotFieldVariable>}
     * @memberof FieldVariablesService
     */
    save(field: DotContentTypeField, variable: DotFieldVariable): Observable<DotFieldVariable> {
        return this.coreWebService
            .requestView({
                body: {
                    'key': variable.key,
                    'value': variable.value,
                    'clazz': 'com.dotcms.contenttype.model.field.FieldVariable',
                    'fieldId': field.id
                },
                method: RequestMethod.Post,
                url: `v1/contenttype/${field.contentTypeId}/fields/id/${field.id}/variables`
            })
            .pipe(pluck('entity'));
    }

    /**
     * Delete Field Variables.
     * @param {FieldVariableParams} params Variable params to be deleted
     * @returns {Observable<DotFieldVariable>}
     * @memberof FieldVariablesService
     */
    delete(field: DotContentTypeField, variable: DotFieldVariable): Observable<DotFieldVariable> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `v1/contenttype/${field.contentTypeId}/fields/id/${field.id}/variables/id/${variable.id}`
            })
            .pipe(pluck('entity'));
    }

}
