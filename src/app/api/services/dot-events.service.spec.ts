import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { DotEventsService } from './dot-events.service';
import { DOTTestBed } from '../../test/dot-test-bed';
import { DotEvent } from '../../shared/models/event/dot-event';

describe('DotEventsService', () => {
    //let service: DotEventsService;
    //let fixture: ComponentFixture<DotEventsService>;
    beforeEach(() => {
        const event: DotEvent = {
            name: 'test',
            data: [1, 2, 3]
        };
        TestBed.configureTestingModule({
            providers: [DotEventsService]
        });

        // fixture = DOTTestBed.createComponent(DotEventsService);
        // service = fixture.componentInstance;
        //
        // service.notify(event);
    });

    xit('should update the subject value', () => {});

    fit('should react to a notification', inject([DotEventsService], (service: DotEventsService) => {
        let numberarray: number[] = [];
        service.listen('test').subscribe(value => {
            numberarray = value.data;
        });

        service.notify({
            name: 'test',
            data: [1, 2, 3]
        });

        expect(numberarray.length).toEqual(3);
    }));
});
