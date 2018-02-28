import { DotLanguagesService } from './dot-languages.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';

fdescribe('DotLanguagesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotLanguagesService]);
        this.dotLanguagesService = this.injector.get(DotLanguagesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Languages', () => {
        let result;

        this.dotLanguagesService.get().subscribe(res => {
            debugger;
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        en: { name: 'English' }
                    }
                })
            )
        );

        expect(result).toEqual([{ id: 'en', label: 'English' }]);

        // this.dotLanguagesService.get().subscribe((languages: Language[]) => {
        //     expect(languages).toEqual([, { id: 'es', label: 'Espanol' }, { id: 'fr', label: 'French' }]);
        // });
    });
});
//
// let result: any;
// editPageService.lock('123').subscribe((lockInfo: any) => (result = lockInfo));
//
// lastConnection[0].mockRespond(
//     new Response(
//         new ResponseOptions({
//             body: {
//                 message: 'locked'
//             }
//         })
//     )
// );
// expect(lastConnection[0].request.url).toContain('/api/content/lock/inode/123');
// expect(result).toEqual({ message: 'locked' });
//





//
//
//
// beforeEach(() => {
//     this.injector = DOTTestBed.resolveAndCreate([WorkflowService]);
//     this.workflowService = this.injector.get(WorkflowService);
//     this.backend = this.injector.get(ConnectionBackend) as MockBackend;
//     this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
// });
//
// it('should get workflows', () => {
//     let result;
//     this.workflowService.get().subscribe((res) => {
//         result = res;
//     });
//
//     this.lastConnection.mockRespond(
//         new Response(
//             new ResponseOptions({
//                 body: {
//                     entity: [
//                         {
//                             hello: 'world',
//                             hola: 'mundo'
//                         }
//                     ]
//                 }
//             })
//         )
//     );
//     expect(result).toEqual([
//         {
//             hello: 'world',
//             hola: 'mundo'
//         }
//     ]);
//     expect(this.lastConnection.request.url).toContain('v1/workflow/schemes');
// });
//
