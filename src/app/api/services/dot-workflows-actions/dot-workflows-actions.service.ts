import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';

@Injectable()
export class DotWorkflowsActionsService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the actions of the received schemas
     *
     * @param {string[]} [workflows=[]]
     * @returns {Observable<DotWorkflowAction>}
     * @memberof DotWorkflowsActionsService
     */
    get(workflows: string[] = []): Observable<DotWorkflowAction[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Post,
                url: '/api/v1/workflow/schemes/actions/NEW',
                body: {
                    schemes: workflows
                }
            })
            .pipe(pluck('entity'));
    }
}
