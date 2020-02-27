import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PushPublishEvent } from '@models/push-publish-data/push-publish-data';

@Injectable()
export class DotPushPublishDialogService {
    private _showDialog: Subject<PushPublishEvent> = new Subject<PushPublishEvent>();

    get showDialog$(): Observable<PushPublishEvent> {
        return this._showDialog.asObservable();
    }

    openDialog(data: PushPublishEvent): void {
        this._showDialog.next(data);
    }
}
