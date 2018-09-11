import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { RequestMethod } from '@angular/http';
import { FieldVariable } from '../content-type-fields-variables/content-type-fields-variables.component';

/**
 * Provide method to handle with the Field Variables
 */
@Injectable()
export class FieldVariablesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Load Field Variables.
     * @param {string} contentTypeId Content Type Id
     * @param {string} fieldId Field Id
     * @returns {Observable<FieldVariable[]>}
     * @memberof FieldVariablesService
     */
    loadFieldVariables(contentTypeId: string, fieldId: string): Observable<FieldVariable[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/contenttype/${contentTypeId}/fields/id/${fieldId}/variables`
            })
            .pluck('entity');
    }

    /**
     * Save Field Variables.
     * @param {string} contentTypeId Content Type Id
     * @param {string} fieldId Field Id
     * @param {FieldVariable} variable Variable data to be saved
     * @returns {Observable<FieldVariable>}
     * @memberof FieldVariablesService
     */
    saveFieldVariables(contentTypeId: string, fieldId: string, variable: FieldVariable): Observable<FieldVariable> {
        return this.coreWebService
            .requestView({
                body: {
                    'key': variable.key,
                    'value': variable.value,
                    'clazz': 'com.dotcms.contenttype.model.field.FieldVariable',
                    'fieldId': fieldId
                },
                method: RequestMethod.Post,
                url: `v1/contenttype/${contentTypeId}/fields/id/${fieldId}/variables`
            })
            .pluck('entity');
    }

    /**
     * Delete Field Variables.
     * @param {string} contentTypeId Content Type Id
     * @param {string} fieldId Field Id
     * @param {string} variableId Variable Id
     * @returns {Observable<FieldVariable>}
     * @memberof FieldVariablesService
     */
    deleteFieldVariables(contentTypeId: string, fieldId: string, variableId: string): Observable<FieldVariable> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `v1/contenttype/${contentTypeId}/fields/id/${fieldId}/variables/id/${variableId}`
            })
            .pluck('entity');
    }

}
