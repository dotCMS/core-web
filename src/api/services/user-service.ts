import {ApiRoot} from "../persistence/ApiRoot";
import {CoreWebService} from "./core-web-service";
import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs/Rx';
import {RequestMethod, Http} from '@angular/http';

@Injectable()
export class UserService extends CoreWebService {
    private userListUrl: string;

    constructor(_apiRoot: ApiRoot, _http: Http) {
        super(_apiRoot, _http);
        this.userListUrl = `${_apiRoot.baseUrl}api/v1/users/filter/permission/1/start/0/limit/30/includeAnonymous/false/includeDefault/false`;
    }

    getAll(): Observable<any> {
        return this.requestView({
            method: RequestMethod.Get,
            url: this.userListUrl
        });
    }
}