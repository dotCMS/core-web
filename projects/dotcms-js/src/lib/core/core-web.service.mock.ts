import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ResponseView } from './util/response-view';
import {
    HttpClient,
    HttpRequest,
    HttpEvent,
    HttpEventType,
    HttpResponse,
    HttpParams,
    HttpHeaders
} from '@angular/common/http';
import { RequestMethod } from '@angular/http';
import { RequestOptionsParams } from 'dotcms-js';

@Injectable()
export class CoreWebServiceMock {
    constructor(private _http: HttpClient) {}

    request(options: any): Observable<any> {
        return this._http
            .request(
                new HttpRequest(
                    RequestMethod[options.method],
                    options.url,
                    options.body,
                    options.params
                )
            )
            .pipe(
                filter(<T>(event: HttpEvent<T>) => event.type === HttpEventType.Response),
                map((resp: HttpResponse<any>) => {
                    try {
                        return resp.body;
                    } catch (error) {
                        return resp;
                    }
                })
            );
    }

    public requestView(options: any): Observable<ResponseView> {
        const optionsArgs: RequestOptionsParams = {
            headers: new HttpHeaders(),
            params: new HttpParams()
        };

        if (options.params) {
            Object.keys(options.params).forEach((key) => {
                optionsArgs.params = optionsArgs.params.set(key, options.params[key]);
            });
        }

        return this._http
            .request(
                new HttpRequest(RequestMethod[options.method], options.url, options.body, {
                    params: optionsArgs.params
                })
            )
            .pipe(
                filter(<T>(event: HttpEvent<T>) => event.type === HttpEventType.Response),
                map((resp: HttpResponse<any>) => {
                    return new ResponseView(resp);
                })
            );
    }

    public subscribeTo(httpErrorCode: number): Observable<any> {
        return of({
            error: httpErrorCode
        });
    }
}
