import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { mergeMap, map, filter } from 'rxjs/operators';
import { DotMenuService } from '../../../../api/services/dot-menu.service';

interface DotAddEditEvents {
    load?: ($event: any) => void;
    keyDown?: ($event: any) => void;
}

export interface DotEditContentlet {
    inode: string;
    events?: DotAddEditEvents;
}

export interface DotAddContentLet {
    type: string;
    container: string;
    events?: DotAddEditEvents;
}

@Injectable()
export class DotContentletEditorService {
    private data: Subject<DotAddContentLet | DotEditContentlet> = new Subject();
    private _load: ($event: any) => void;
    private _keyDown: ($event: any) => void;

    constructor(private dotMenuService: DotMenuService) {}

    get add$(): Observable<string> {
        return this.data.asObservable().pipe(
            filter((data: DotAddContentLet) => data === null || !!data.container),
            map((data: DotAddContentLet) => data === null ? '' : this.geAddtUrl(data))
        );
    }

    get edit$(): Observable<string> {
        return this.data.pipe(
            filter((data: DotEditContentlet) => data === null || !!data.inode),
            mergeMap((data: DotEditContentlet) => data === null ? Observable.of('') : this.getEditUrl(data))
        );
    }

    get load(): ($event: any) => void {
        return this._load;
    }

    get keyDown(): ($event: any) => void {
        return this._keyDown;
    }

    /**
     * Set data to add a contentlet
     *
     * @param {DotAddContentLet} data
     * @memberof DotAddContentletServicex
     */
    add(data: DotAddContentLet) {
        this.setData(data);
    }

    /**
     * Set data to edit a contentlet
     *
     * @param {DotAddContentLet} data
     * @memberof DotAddContentletServicex
     */
    edit(data: DotEditContentlet) {
        this.setData(data);
    }

    /**
     * Clear data to add a contentlet
     *
     * @memberof DotAddContentletService
     */
    clear() {
        this.data.next(null);
        this._load = null;
        this._keyDown = null;
    }

    private geAddtUrl(data: DotAddContentLet): string {
        return `/html/ng-contentlet-selector.jsp?ng=true&container_id=${data.container}&add=${data.type}`;
    }

    private bindEvents(events: DotAddEditEvents): void {
        if (events.load) {
            this._load = events.load;
        }
        if (events.keyDown) {
            this._keyDown = events.keyDown;
        }
    }

    private getEditUrl(data: DotEditContentlet): Observable<string> {
        return this.dotMenuService.getDotMenuId('content').pipe(
            map((portletId: string) => {
                return [
                    `/c/portal/layout`,
                    `?p_l_id=${portletId}`,
                    `&p_p_id=content`,
                    `&p_p_action=1`,
                    `&p_p_state=maximized`,
                    `&p_p_mode=view`,
                    `&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet`,
                    `&_content_cmd=edit&inode=${data.inode}`
                ].join('');
            })
        );
    }

    private setData(data: DotAddContentLet | DotEditContentlet): void {
        if (data.events) {
            this.bindEvents(data.events);
        }

        const { events, ...noEventsData } = data;
        this.data.next(noEventsData);
    }
}
