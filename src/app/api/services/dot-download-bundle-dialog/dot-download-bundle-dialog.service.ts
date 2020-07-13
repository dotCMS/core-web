import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DotDownloadBundleDialogService {
    private data: Subject<string> = new Subject<string>();

    get showDialog$(): Observable<string> {
        return this.data.asObservable();
    }

    open(data: string): void {
        this.data.next(data);
    }
}
