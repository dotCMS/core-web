import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DotGenerateSecurePasswordService {
    private data: Subject<{ [key: string]: any }> = new Subject<{ [key: string]: any }>();

    get showDialog$(): Observable<{ [key: string]: any }> {
        return this.data.asObservable();
    }

    /**
     * Notify subscribers with new data
     *
     * @param string data
     * @memberof DotGenerateSecurePasswordService
     */
    open(data: { [key: string]: any }): void {
        this.data.next(data);
    }
}
