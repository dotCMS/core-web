import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {LoggerService} from './logger.service';
import {Subject} from 'rxjs/Subject';
import {Protocol} from './protocol/protocol';
import {SocketFactory} from './protocol/socket-factory';

@Injectable()
export class DotcmsEventsService {

    private socket: Protocol;
    private subjects: Subject<any>[] = [];

    constructor(private socketFactory: SocketFactory, private loggerService: LoggerService) {

    }

    /**
     * Close the socket
     */
    destroy(): void {
        this.socket.destroy();
        this.socketFactory.clean();
        this.socket = null;
    }

    /**
     * Start the socket
     */
    start(): void {
        this.loggerService.debug('start DotcmsEventsService');
        if (!this.socket) {
            this.socketFactory.createSocket().subscribe(socket => {
                this.socket = socket;

                socket.message$().subscribe(
                    data => {
                        console.log('data', data);
                        if (!this.subjects[data.event]) {
                            this.subjects[data.event] = new Subject();
                        }
                        this.subjects[data.event].next(data.payload);
                    },
                     (e) => {
                        this.loggerService.debug('Error in the System Events service: ' + e.message);
                    },
                    () => {
                        this.loggerService.debug('Completed');
                    }
                );

                this.loggerService.debug('Connecting with socket');
                socket.start();
            });
        }
    }

    /**
     * This method will be called by clients that want to receive notifications
     * regarding incoming system events. The events they will receive will be
     * based on the type of event clients register for.
     *
     * @param clientEventType - The type of event clients will get. For example,
     *                          "notification" will allow a client to receive the
     *                          messages in the Notification section.
     * @returns {any} The system events that a client will receive.
     */
    subscribeTo(clientEventType: string): Observable<any> {
        if (!this.subjects[clientEventType]) {
            this.subjects[clientEventType] = new Subject();
        }

        return this.subjects[clientEventType].asObservable();
    }

    subscribeToEvents(clientEventTypes: string[]): Observable<EventTypeWrapper> {
        let subject: Subject<EventTypeWrapper> = new Subject<EventTypeWrapper>();

        clientEventTypes.forEach(eventType => this.subscribeTo(eventType).subscribe(data => subject.next({
            data: data,
            eventType: eventType
        })));

        return subject.asObservable();
    }
}

interface EventTypeWrapper {
    data: any;
    eventType: string;
}
