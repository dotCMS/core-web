import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export interface DotAddContentLet {
    type: string;
    container: string;
    load?: ($event: any) => void;
    keyDown?: ($event: any) => void;
}

@Injectable()
export class DotAddContentletService {
    data: Subject<DotAddContentLet> = new Subject();
    private _load: ($event: any) => void;
    private _keyDown: ($event: any) => void;

    constructor() {}

    get action$(): Observable<DotAddContentLet> {
        return this.data.asObservable();
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
        if (data.load) {
            this._load = data.load;
        }

        if (data.keyDown) {
            this._keyDown = data.keyDown;
        }

        this.data.next(data);
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
}
