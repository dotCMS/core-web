import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SelectItemGroup } from 'primeng/primeng';

import { DotWorkflowsActionsSelectorFieldService } from './dot-workflows-actions-selector-field.service';
import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { mockWorkflowsActions } from '@tests/dot-workflows-actions.mock';
import { mockWorkflows } from '@tests/dot-workflow-service.mock';

describe('DotWorkflowsActionsSelectorFieldService', () => {
    let dotWorkflowsActionsService: DotWorkflowsActionsService;
    let service: DotWorkflowsActionsSelectorFieldService;

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                DotWorkflowsActionsSelectorFieldService,
                {
                    provide: DotWorkflowsActionsService,
                    useValue: {
                        getByWorkflows() {
                            return of(mockWorkflowsActions);
                        }
                    }
                }
            ]
        })
    );

    beforeEach(() => {
        dotWorkflowsActionsService = TestBed.get(DotWorkflowsActionsService);
        service = TestBed.get(DotWorkflowsActionsSelectorFieldService);
        spyOn(dotWorkflowsActionsService, 'getByWorkflows').and.callThrough();
    });

    it('should be get actions grouped by workflows as SelectItemGroup', () => {
        let result: SelectItemGroup[];

        service.get().subscribe((actions: SelectItemGroup[]) => {
            result = actions;
        });

        service.load(mockWorkflows);

        expect(dotWorkflowsActionsService.getByWorkflows).toHaveBeenCalledWith(
            jasmine.arrayContaining(mockWorkflows)
        );

        expect(result).toEqual([
            {
                label: 'Default Scheme',
                value: '85c1515c-c4f3-463c-bac2-860b8fcacc34',
                items: [{ label: 'Assign Workflow', value: '44d4d4cd-c812-49db-adb1-1030be73e69a' }]
            },
            {
                label: 'Document Management',
                value: '77a9bf3f-a402-4c56-9b1f-1050b9d345dc',
                items: []
            },
            {
                label: 'System Workflow',
                value: 'd61a59e1-a49c-46f2-a929-db2b4bfa88b2',
                items: [
                    { label: 'Save', value: 'ceca71a0-deee-4999-bd47-b01baa1bcfc8' },
                    { label: 'Save / Publish', value: 'b9d89c80-3d88-4311-8365-187323c96436' }
                ]
            }
        ]);
    });
});
