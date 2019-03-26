import { Injectable } from '@angular/core';
import { DotLoginInformation } from '@models/dot-login';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginPageStateService {
    private _dotLoginInformation: Observable<DotLoginInformation>;

    constructor() {}

    get dotLoginInformation(): Observable<DotLoginInformation> {
        return this._dotLoginInformation;
    }

    set dotLoginInformation(loginInfo: Observable<DotLoginInformation>) {
        this._dotLoginInformation = loginInfo;
    }
}
