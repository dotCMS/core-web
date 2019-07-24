import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { DotWorkflowsActionsService } from './dot-workflows-actions.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { mockWorkflowsActions } from '@tests/dot-workflows-actions.mock';
import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';

describe('DotWorkflowsActionsService', () => {
    let TestBed;
    let dotWorkflowService;
    let backend;
    let lastConnection;

    beforeEach(() => {
        TestBed = DOTTestBed.resolveAndCreate([DotWorkflowsActionsService]);
        dotWorkflowService = TestBed.get(DotWorkflowsActionsService);
        backend = TestBed.get(ConnectionBackend) as MockBackend;
        backend.connections.subscribe((connection: any) => {
            lastConnection = connection;
        });
    });

    it('should get actions', () => {
        let result;
        dotWorkflowService.get(['123', '456']).subscribe((res: DotWorkflowAction[]) => {
            result = res;
        });

        lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: [...mockWorkflowsActions]
                    }
                })
            )
        );

        expect(lastConnection.request.method).toBe(1);
        expect(lastConnection.request.url).toBe('/api/v1/workflow/schemes/actions/NEW');
        expect(lastConnection.request._body).toEqual({ schemes: ['123', '456'] });
        expect(result).toEqual([...mockWorkflowsActions]);
    });
});
