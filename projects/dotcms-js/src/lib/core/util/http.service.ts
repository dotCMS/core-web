import { Inject, Injectable, NgModule } from '@angular/core';
import { Http, Headers, Response, RequestMethod, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { SettingsStorageService } from './settings-storage.service';

/**
 * The HTTPClient will use the JWTToken and Host/Site set in the SettingsStorageService to connect dotCMS REST Endpoints
 *
 */
@Injectable()
@Inject('http')
@Inject('settingsStorageService')
export class HttpClient {
    public progress$: any;
    private progressObserver: any;
    private progress: number;
    constructor(private http: Http, private settingsStorageService: SettingsStorageService) {
        // this.http = http;
        // this.settingsService=settingsService;
        this.progress$ = Observable.create((observer: any) => {
            this.progressObserver = observer;
        }).pipe(share());
    }

    /**
     * Will append JWT Header to passed in Headers
     * @param headers
     */
    createAuthorizationHeader(headers: Headers): void {
        if (
            this.settingsStorageService.getSettings() != null &&
            this.settingsStorageService.getSettings().jwt != null &&
            this.settingsStorageService.getSettings().jwt.trim().length > 0
        ) {
            headers.append(
                'Authorization',
                'Bearer ' + this.settingsStorageService.getSettings().jwt
            );
        }
    }

    /**
     * Currently uses a debouce time of 400 and distinctUntilChanged flags on a GET request.  This is intended to
     * limit unecessary requests to the dotCMS Endpoints. Will append needed dotCMS Host/Site and JWT AUth Token
     * @param path Endpoint path
     * @returns Observable<Response>
     */
    get(path: string): Observable<Response> {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        const site: String = this.settingsStorageService.getSettings().site;
        return this.http.get((site ? site : '') + path, { headers: headers }).pipe(
            debounceTime(400),
            distinctUntilChanged()
        );
    }

    /**
     * Currently uses a debouce time of 400 and distinctUntilChanged flags on a GET request.  This is intended to
     * limit unecessary requests to the dotCMS Endpoints. Will append needed dotCMS Host/Site and JWT AUth Token
     * @param path path Endpoint path
     * @param data Object to be PUT.  Will be converted to JSON String(JSON.stringify)
     * @returns Observable<Response>
     */
    put(path: String, data: Object): Observable<Response> {
        const opts: RequestOptions = new RequestOptions();
        opts.method = RequestMethod.Put;
        opts.headers = new Headers({ 'Content-Type': 'application/json' });
        this.createAuthorizationHeader(opts.headers);
        return this.http
            .put(
                this.settingsStorageService.getSettings().site + path.toString(),
                JSON.stringify(data),
                opts
            )
            .pipe(
                debounceTime(400),
                distinctUntilChanged()
            );
    }

    /**
     * Currently uses a debouce time of 400 and distinctUntilChanged flags on a GET request.  This is intended to
     * limit unecessary requests to the dotCMS Endpoints. Will append needed dotCMS Host/Site and JWT AUth Token
     * @param path path Endpoint path
     * @param data Object to be POSTed.  Will be converted to JSON String(JSON.stringify)
     * @returns Observable<Response>
     */
    post(path: String, data: Object): Observable<Response> {
        const opts: RequestOptions = new RequestOptions();
        opts.method = RequestMethod.Post;
        opts.headers = new Headers({ 'Content-Type': 'application/json' });
        this.createAuthorizationHeader(opts.headers);
        return this.http.post(
            this.settingsStorageService.getSettings().site + path,
            JSON.stringify(data),
            opts
        );
    }

    /**
     * Intended to simply saving FileAssets to dotCMS. Currently uses a debouce time of 400 and distinctUntilChanged flags on a GET request
     * This is intended to
     * limit unecessary requests to the dotCMS Endpoints. Will append needed dotCMS Host/Site and JWT AUth Token
     * @param path path Endpoint path
     * @param file Binary file to save
     * @param jsonData Object to be POSTed.  Will be converted to JSON String(JSON.stringify)
     * @returns any
     */
    filePut(path: String, file: File, data: Object): Observable<any> {
        return Observable.create((observer: any) => {
            const formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            formData.append('json', JSON.stringify(data));

            formData.append('fileAsset', file);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round((event.loaded / event.total) * 100);

                this.progressObserver.next(this.progress);
            };
            const site: String = this.settingsStorageService.getSettings().site;
            xhr.open('PUT', (site ? site : '') + path.toString(), true);
            if (
                this.settingsStorageService.getSettings() != null &&
                this.settingsStorageService.getSettings().jwt != null &&
                this.settingsStorageService.getSettings().jwt.trim().length > 0
            ) {
                xhr.setRequestHeader(
                    'Authorization',
                    'Bearer ' + this.settingsStorageService.getSettings().jwt
                );
            }
            xhr.send(formData);
        });
    }
}

@NgModule({
    providers: [HttpClient, SettingsStorageService]
})
export class DotHttpModule {}
