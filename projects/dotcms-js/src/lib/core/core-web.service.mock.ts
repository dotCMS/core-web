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
import { RequestMethod, RequestOptionsArgs } from '@angular/http';
import { RequestOptionsParams } from 'dotcms-js';

@Injectable()
export class CoreWebServiceMock {
    constructor(private _http: HttpClient) {}

    request(options: RequestOptionsArgs): Observable<any> {
        const optionsArgs: RequestOptionsParams = {
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
                    try {
                        return resp.body;
                    } catch (error) {
                        return resp;
                    }
                })
            );
    }

    requestView(options: RequestOptionsArgs): Observable<ResponseView> {
        const optionsArgs: RequestOptionsParams = {
            headers: new HttpHeaders(),
            params: new HttpParams()
        };

        if (options.params) {
            Object.keys(options.params).forEach((key) => {
                optionsArgs.params = optionsArgs.params.set(key, options.params[key]);
            });
        }

        if (options.search) {
            optionsArgs.params = this.setHttpParams(options.search, optionsArgs.params);
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

    subscribeTo(httpErrorCode: number): Observable<any> {
        return of({
            error: httpErrorCode
        });
    }

    private setHttpParams(urlParams: any, httpParams: HttpParams): HttpParams {
        if (urlParams.paramsMap) {
            const searchParams = urlParams.toString().split('&');
            searchParams.forEach((paramString: string) => {
                const [key, value] = paramString.split('=');
                httpParams = httpParams.set(key, value);
            });
        } else {
            Object.keys(urlParams).forEach((key: string) => {
                httpParams = httpParams.set(key, urlParams[key]);
            });
        }
        return httpParams;
    }
}
