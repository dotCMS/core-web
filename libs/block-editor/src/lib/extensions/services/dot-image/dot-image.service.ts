import { Injectable } from '@angular/core';
import { DotAssetService, DotUploadService } from '@dotcms/utils';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { map, mergeMap, pluck, switchMap, take } from 'rxjs/operators';
import { DotCMSContentlet, DotCMSTempFile, DotHttpErrorResponse } from '@dotcms/dotcms-models';

@Injectable({
    providedIn: 'root'
})
export class DotImageService {
    uploadService;
    assetService;

    constructor() {
        this.uploadService = new DotUploadService();
        this.assetService = new DotAssetService();
    }

    get(data: File | File[], progressCallBack?, maxSize?: string): Observable<any> {
        return this.setTempResource(data, progressCallBack, maxSize).pipe(
            switchMap((response: DotCMSTempFile | DotCMSTempFile[]) => {
                const files = Array.isArray(response) ? response : [response];
                return new Observable((observer: Observer<object>) => {
                    let cont = 0;
                    files.forEach((file: DotCMSTempFile) => {
                        const data = {
                            contentlet: {
                                baseType: 'dotAsset',
                                asset: file.id,
                                hostFolder: '',
                                indexPolicy: 'WAIT_FOR'
                            }
                        };
                        this.assetService
                            .fetchAsset(
                                'http://localhost:8080/api/v1/workflow/actions/default/fire/PUBLISH',
                                data
                            )
                            .then((response) => {
                                response.json().then((data) => {
                                    observer.next(data.entity);
                                    cont++;
                                    if (cont === files.length) {
                                        observer.complete();
                                    }
                                });
                            });
                    });
                });
            })
        );
    }

    private setTempResource(
        data: File | File[],
        progressCallBack?,
        maxSize?: string
    ): Observable<any> {
        return from(this.uploadService.uploadBinaryFile(data, progressCallBack, maxSize));
    }
}
