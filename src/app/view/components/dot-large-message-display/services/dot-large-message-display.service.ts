import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DotcmsEventsService, DotEventData } from 'dotcms-js';

export interface DotLargeMessageDisplayParams {
    title: string;
    width?: string;
    height?: string;
    body?: string;
    code?: {
        lang: string;
        content: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class DotLargeMessageDisplayService {
    private _messages: Subject<DotLargeMessageDisplayParams> = new Subject();

    constructor(dotcmsEventsService: DotcmsEventsService) {
        dotcmsEventsService.subscribeTo('LARGE_MESSAGE').subscribe((messageEvent: DotEventData) => {
            const { code, width, body, title, height } = messageEvent.data;
            this._messages.next({ title, height, width, body, code });
        });
    }

    next() {
        this._messages.next({
            title: 'Heading',
            body: '<div style="border: solid 1px red">hello world</div>',
            code: {
                lang: 'javascript',
                content: 'var a = "hello"'
            }
        });
    }

    /**
     * Clear service's Observable content
     *
     * @memberof DotLargeMessageDisplayService
     */
    clear(): void {
        this._messages.next(null);
    }

    /**
     * Allow subscribe to receive new messages
     *
     * @returns {Observable<DotLargeMessageDisplayParams>}
     * @memberof DotLargeMessageDisplayService
     */
    sub(): Observable<DotLargeMessageDisplayParams> {
        return this._messages.asObservable();
    }
}
