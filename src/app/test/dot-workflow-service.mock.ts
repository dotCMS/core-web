import { Observable } from 'rxjs/Observable';
import { Workflow } from '../shared/models/workflow/workflow.model';

export class WorkflowServiceMock {
    getPageWorkflows(): Observable<Workflow[]> {
        return Observable.of([
            {
                assignable: false,
                commentable: false,
                condition: '',
                icon: 'workflowIcon',
                id: 'ceca71a0-deee-4999-bd47-b01baa1bcfc8',
                name: 'Save',
                nextAssign: '654b0931-1027-41f7-ad4d-173115ed8ec1',
                nextStep: 'ee24a4cb-2d15-4c98-b1bd-6327126451f3',
                nextStepCurrentStep: false,
                order: 0,
                owner: null,
                requiresCheckout: true,
                roleHierarchyForAssign: false,
                schemeId: 'd61a59e1-a49c-46f2-a929-db2b4bfa88b2',
                showOn: ['LOCKED'],
                stepId: null
            }
        ]);
    }
}