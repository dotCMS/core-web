import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import {Workflow} from '../../../shared/models/workflow/workflow.model';

/**
 * Provide util methods to get Workflows.
 * @export
 * @class WorkflowService
 */
@Injectable()
export class WorkflowService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Method to get Workflows
     * @param {string} id
     * @returns {Observable<SelectItem[]>}
     * @memberof WorkflowService
     */
    get(): Observable<Workflow[]> {
        const dummyWorkflows: Workflow[] = [
            {
                name: 'WorkFlow #1',
                identifier: '1'
            },
            {
                name: 'WorkFlow #2',
                identifier: '2'
            },
            {
                name: 'Long Description WorkFlow #3. Lorem Ipsum. Lorem Ipsum. Lorem Ipsum ',
                identifier: '3'
            },
            {
                name: 'WorkFlow #4',
                identifier: '4'
            },
            {
                name: 'WorkFlow #5',
                identifier: '5'
            }
        ];
        return Observable.of(dummyWorkflows);
    }
}
