import { DotWorkflowActionsFireService } from './dot-workflow-actions-fire.service';
import { DOTTestBed } from '@tests/dot-test-bed';

import { ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

fdescribe('DotWorkflowActionsFireService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotWorkflowActionsFireService]);
        this.dotWorkflowActionsFireService = this.injector.get(DotWorkflowActionsFireService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should create and return a new Content', () => {
        let result;
        this.dotWorkflowActionsFireService.new('persona', { name: 'Test' }).subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: [
                            {
                                name: 'test'
                            }
                        ]
                    }
                })
            )
        );

        expect(result).toEqual([
            {
                name: 'test'
            }
        ]);

        expect(this.lastConnection.request.url).toContain('v1/workflow/actions/default/fire/NEW');
    });

    it('should create and return a new Content', () => {
        let result;
        this.dotWorkflowActionsFireService.toContentlet('123', 'new').subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: [
                            {
                                name: 'test'
                            }
                        ]
                    }
                })
            )
        );

        expect(result).toEqual([
            {
                name: 'test'
            }
        ]);

        expect(this.lastConnection.request.url).toContain('v1/workflow/actions/new/fire?inode=123');
    });
});
