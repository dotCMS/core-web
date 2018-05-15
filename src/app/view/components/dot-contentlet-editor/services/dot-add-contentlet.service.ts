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
    data: {
        [key: string]: string
    };
    events?: DotAddEditEvents;
}

export interface DotAddContentLet {
    data: {
        [key: string]: string
    };
    events?: DotAddEditEvents;
}

/**
 * Handle the url and events for add and edit contentlet components
 *
 * @export
 * @class DotContentletEditorService
 */
@Injectable()
export class DotContentletEditorService {
    private data: Subject<DotAddContentLet | DotEditContentlet> = new Subject();
    private _load: ($event: any) => void;
    private _keyDown: ($event: KeyboardEvent) => void;

    constructor(private dotMenuService: DotMenuService) {}

    get addUrl$(): Observable<string> {
        return this.data.asObservable().pipe(
            filter((action: DotAddContentLet) => action === null || !!action.data.container),
            map((action: DotAddContentLet) => action === null ? '' : this.geAddtUrl(action.data))
        );
    }

    get editUrl$(): Observable<string> {
        return this.data.pipe(
            filter((action: DotEditContentlet) => action === null || !!action.data.inode),
            mergeMap((action: DotEditContentlet) => action === null ? Observable.of('') : this.getEditUrl(action.data))
        );
    }

    get loadHandler(): ($event: any) => void {
        return this._load;
    }

    get keyDownHandler(): ($event: any) => void {
        return this._keyDown;
    }


    /**
     * Set data to add a contentlet
     *
     * @param {DotAddContentLet} action
     * @memberof DotAddContentletServicex
     */
    add(action: DotAddContentLet) {
        this.setData(action);
    }

    /**
     * Set data to edit a contentlet
     *
     * @param {DotAddContentLet} action
     * @memberof DotAddContentletServicex
     */
    edit(action: DotEditContentlet) {
        this.setData(action);
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

    /**
     * Call keydown handler
     *
     * @param {KeyboardEvent} $event
     * @memberof DotContentletEditorService
     */
    keyDown($event: KeyboardEvent): void {
        if (this._keyDown) {
            this._keyDown($event);
        }
    }

    /**
     * Call load handler
     *
     * @param {*} $event
     * @memberof DotContentletEditorService
     */
    load($event: any): void {
        if (this._load) {
            this._load($event);
        }
    }

    private geAddtUrl(data: {[key: string]: string}): string {
        return `/html/ng-contentlet-selector.jsp?ng=true&container_id=${data.container}&add=${data.baseTypes}`;
    }

    private bindEvents(events: DotAddEditEvents): void {
        if (events.load) {
            this._load = events.load;
        }
        if (events.keyDown) {
            this._keyDown = events.keyDown;
        }
    }

    private getEditUrl(data: {[key: string]: string}): Observable<string> {
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

    private setData(action: DotAddContentLet | DotEditContentlet): void {
        if (action.events) {
            this.bindEvents(action.events);
        }

        this.data.next({
            data: action.data
        });
    }
}
