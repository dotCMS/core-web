/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DotInterceptor } from './dot-interceptor.service.ts.service';

describe('Service: DotInterceptor.service.ts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DotInterceptor]
        });
    });

    it(
        'should ...',
        inject([DotInterceptor], (service: DotInterceptor) => {
            expect(service).toBeTruthy();
        })
    );
});
