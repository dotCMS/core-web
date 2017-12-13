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
    private urls: any;

    constructor(private coreWebService: CoreWebService) {
        this.urls = {
            getWorkflowSchemes: 'v1/workflow/schemes'
        };
    }

    /**
     * Method to get Workflows
     * @param {string} id
     * @returns {Observable<SelectItem[]>}
     * @memberof WorkflowService
     */
    get(): Observable<Workflow[]> {
        return this.coreWebService.request({
            method: RequestMethod.Get,
            url: this.urls.getWorkflowSchemes
        }).pluck('entity');
    }
}
