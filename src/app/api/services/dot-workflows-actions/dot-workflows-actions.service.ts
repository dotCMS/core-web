import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';

@Injectable()
export class DotWorkflowsActionsService {
    private data$: Subject<DotWorkflowAction[]> = new Subject();

    constructor(private coreWebService: CoreWebService) {}

    /**
     * Load and update actions
     *
     * @param {string[]} workflows
     * @memberof DotWorkflowsActionsService
     */
    load(workflows: string[]): void {
        if (workflows && workflows.length) {
            this.coreWebService
                .requestView({
                    method: RequestMethod.Post,
                    url: '/api/v1/workflow/schemes/actions/NEW',
                    body: {
                        schemes: workflows
                    }
                })
                .pipe(
                    take(1),
                    pluck('entity')
                )
                .subscribe((actions: DotWorkflowAction[]) => {
                    this.data$.next(actions);
                });
        } else {
            this.data$.next([]);
        }
    }

    /**
     * Return the actions
     *
     * @returns {Observable<DotWorkflowAction[]>}
     * @memberof DotWorkflowsActionsService
     */
    get(): Observable<DotWorkflowAction[]> {
        return this.data$.asObservable();
    }
}
