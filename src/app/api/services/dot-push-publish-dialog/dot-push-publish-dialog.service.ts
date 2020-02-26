import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DotPushPublishDialogService {
    private _showDialog: Subject<string> = new Subject<string>();

    get showDialog$(): Observable<string> {
        return this._showDialog.asObservable();
    }

    openDialog(assetIdentifier: string): void {
        this._showDialog.next(assetIdentifier);
    }
}
