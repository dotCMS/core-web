
import { ReflectiveInjector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DotcmsEventsService } from './dotcms-events.service';
import { StringUtils } from './string-utils.service';
import { LoggerService } from './logger.service';
import { DotEventTypeWrapper } from './models';
import { DotEventMessage } from './util/models/dot-event-message';
import { DotEventsSocket } from 'dotcms-js';

class DotEventsSocketMock {
    _messages: Subject<any> = new Subject();

    connect(): void {}

    messages(): Observable<any> {
        return this._messages.asObservable();
    }

    public sendMessage(message: DotEventMessage) {
        this._messages.next(message);
    }
}

fdescribe('DotcmsEventsService', () => {

    let socket: DotEventsSocketMock;
    let dotcmsEventsService: DotcmsEventsService;

    let injector: ReflectiveInjector;

    beforeEach(() => {
        socket = new DotEventsSocketMock();

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: DotEventsSocket, useValue: socket },
            StringUtils,
            LoggerService,
            DotcmsEventsService
        ]);

        dotcmsEventsService = injector.get(DotcmsEventsService);
    });

    it('should create and connect a new socket', () => {
        spyOn(socket, 'connect');

        dotcmsEventsService.start();

        expect(socket.connect).toHaveBeenCalled();
    });

    it('should reuse socket connection', () => {
        spyOn(socket, 'connect');

        dotcmsEventsService.start();
        dotcmsEventsService.start();

        expect(socket.connect).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to a event', (done) => {
        dotcmsEventsService.start();

        dotcmsEventsService.subscribeTo('test_event').subscribe((dotEventData: any) => {
            expect(dotEventData).toEqual('test payload');
            done();
        });

        socket.sendMessage({
            event: 'test_event',
            payload: 'test payload'
        });
    });

    it('should subscribe to several events', () => {
        let count = 0;

        dotcmsEventsService.start();

        dotcmsEventsService.subscribeToEvents(['test_event_1', 'test_event_2'])
            .subscribe((dotEventTypeWrapper: DotEventTypeWrapper) => {
                if (dotEventTypeWrapper.eventType === 'test_event_1') {
                    expect(dotEventTypeWrapper.data).toEqual('test payload_1');
                } else if (dotEventTypeWrapper.eventType === 'test_event_2') {
                    expect(dotEventTypeWrapper.data).toEqual('test payload_2');
                } else {
                    expect(true).toBe(false);
                }

                count++;
            });

            socket.sendMessage({
            event: 'test_event_1',
            payload: 'test payload_1'
        });

        socket.sendMessage({
            event: 'test_event_2',
            payload: 'test payload_2'
        });

        expect(count).toBe(2);
    });
});
