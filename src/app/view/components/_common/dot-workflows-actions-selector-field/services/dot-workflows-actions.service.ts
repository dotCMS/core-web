import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';

export interface DotWorkflowsAction {
    id: string;
    name: string;
    schemeId: string;
    condition: string;
    nextStep: string;
    nextAssign: string;
    icon: string;
    roleHierarchyForAssign: boolean;
    assignable: boolean;
    commentable: boolean;
    order: number;
    owner?: string;
    nextStepCurrentStep: boolean;
    showOn: string[];
}

@Injectable()
export class DotWorkflowsActionsService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the actions of the received schemas
     *
     * @param {string[]} [workflows=[]]
     * @returns {Observable<DotWorkflowsAction>}
     * @memberof DotWorkflowsActionsService
     */
    get(workflows: string[] = []): Observable<DotWorkflowsAction[]> {
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
