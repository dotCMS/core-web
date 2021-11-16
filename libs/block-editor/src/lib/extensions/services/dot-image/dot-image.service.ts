import { Injectable } from '@angular/core';
import { uploadBinaryFile } from '@dotcms/utils';
import { from, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DotCMSTempFile } from '@dotcms/dotcms-models';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DotImageService {
    constructor(private http: HttpClient) {}

    get(data: File | File[], maxSize?: string): Observable<any> {
        return this.setTempResource(data, maxSize).pipe(
            map((response: DotCMSTempFile | DotCMSTempFile[]) => {
                const files = Array.isArray(response) ? response : [response];
                return new Observable((observer: Observer<object>) => {
                    let contentlets = [];
                    files.forEach((file: DotCMSTempFile) => {
                        contentlets.push({
                            baseType: 'dotAsset',
                            asset: file.id,
                            hostFolder: '',
                            indexPolicy: 'WAIT_FOR'
                        });
                        return this.http.post(
                            '/api/v1/workflow/actions/default/fire/PUBLISH',
                            JSON.stringify({ contentlets }),
                            {
                                headers: {
                                    Origin: window.location.hostname,
                                    'Content-Type': 'application/json;charset=UTF-8',
                                    Authorization: 'Basic YWRtaW5AZG90Y21zLmNvbTphZG1pbg=='
                                }
                            }
                        );
                    });
                });
            })
        );
    }

    private setTempResource(data: File | File[], maxSize?: string): Observable<any> {
        return from(uploadBinaryFile(data, () => {}, maxSize));
    }
}
