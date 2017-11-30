import { TestBed } from '@angular/core/testing';
import { DotEventsService } from './dot-events.service';
import { DotEvent } from '../../shared/models/event/dot-event';

fdescribe('DotEventsService', () => {
    let dotEventsService: DotEventsService;
    const testEvent: DotEvent = {
        name: 'test',
        data: [1, 2, 3]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DotEventsService]
        });

        dotEventsService = TestBed.get(DotEventsService);
    });
    it('should filter notifications based on event name', () => {
        let timesCalled = 0;
        dotEventsService.listen('test').subscribe(value => {
            timesCalled++;
        });
        dotEventsService.listen('randomEvent').subscribe(value => {
            timesCalled++;
        });

        dotEventsService.notify(testEvent);

        expect(timesCalled).toEqual(1);
    });

    it('should notify subscribers', () => {
        let numbersArray: number[] = [];
        dotEventsService.listen('test').subscribe(value => {
            numbersArray = value.data;
        });

        dotEventsService.notify(testEvent);

        expect(numbersArray.length).toEqual(3);
    });
});
