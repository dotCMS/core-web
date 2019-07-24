import { of as observableOf, Observable } from 'rxjs';
import { DotWorkflowAction } from '@models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflow } from '@models/dot-workflow/dot-workflow.model';
import * as _ from 'lodash';
import { mockWorkflowsActions } from './dot-workflows-actions.mock';

export const mockWorkflows: DotWorkflow[] = [
    {
        id: '85c1515c-c4f3-463c-bac2-860b8fcacc34',
        creationDate: new Date(1522938093320),
        name: 'Default Scheme',
        description: 'This is the default workflow scheme that will be applied to all content',
        archived: false,
        mandatory: false,
        defaultScheme: true,
        modDate: new Date(1522881184568),
        entryActionId: null,
        system: false
    },
    {
        id: '77a9bf3f-a402-4c56-9b1f-1050b9d345dc',
        creationDate: new Date(1522938093321),
        name: 'Document Management',
        description: 'Default workflow for documents',
        archived: true,
        mandatory: false,
        defaultScheme: false,
        modDate: new Date(1522794958967),
        entryActionId: null,
        system: false
    },
    {
        id: 'd61a59e1-a49c-46f2-a929-db2b4bfa88b2',
        creationDate: new Date(1522938093321),
        name: 'System Workflow',
        description: '',
        archived: false,
        mandatory: false,
        defaultScheme: false,
        modDate: new Date(1522794958958),
        entryActionId: null,
        system: true
    }
];

export class DotWorkflowServiceMock {
    get(): Observable<DotWorkflow[]> {
        return observableOf(_.cloneDeep(mockWorkflows));
    }

    getSystem(): Observable<DotWorkflow> {
        const systemWorkflow = mockWorkflows.filter((workflow: DotWorkflow) => workflow.system);
        return observableOf(_.cloneDeep(systemWorkflow[0]));
    }

    getContentWorkflowActions(_inode: string): Observable<DotWorkflowAction[]> {
        return observableOf(_.cloneDeep(mockWorkflowsActions));
    }

    fireWorkflowAction(): Observable<any[]> {
        return observableOf([]);
    }
}
