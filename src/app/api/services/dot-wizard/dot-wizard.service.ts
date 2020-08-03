import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class DotWizardService {
    private data: Subject<any> = new Subject<any>();

    get showDialog$(): Observable<string> {
        return this.data.asObservable();
    }

    open(_steps: any): Observable<{ [key: string]: string }> {
        return null
    }
}
