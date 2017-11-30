import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {DotEvent} from '../../shared/models/event/dot-event';

@Injectable()
export class DotEventsService {
    private subject: Subject<DotEvent> = new BehaviorSubject({name: ''});

    constructor() {}

    listen(event: string): Observable<DotEvent> {
        return this.subject.asObservable().filter(res => res.name === event);
    }

    notify(event: DotEvent): void {
        this.subject.next(event);
    }
}
