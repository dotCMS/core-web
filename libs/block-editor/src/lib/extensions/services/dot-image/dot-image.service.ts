import { Injectable } from '@angular/core';
import { DotAssetService, DotUploadService } from '@dotcms/utils';
import { from, Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DotCMSTempFile } from '@dotcms/dotcms-models';

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

    get(data: File | File[], maxSize?: string): Observable<any> {
        return this.setTempResource(data, maxSize).pipe(
            switchMap((response: DotCMSTempFile | DotCMSTempFile[]) => {
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

                        fetch(
                            'http://localhost:8080/api/v1/workflow/actions/default/fire/PUBLISH',
                            {
                                method: 'POST',
                                headers: {
                                    Origin: window.location.hostname,
                                    'Content-Type': 'application/json;charset=UTF-8',
                                    Authorization: 'Basic YWRtaW5AZG90Y21zLmNvbTphZG1pbg=='
                                },
                                body: JSON.stringify({ contentlets })
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                observer.next(data.entity.results);
                            });
                    });
                });
            })
        );
    }

    private setTempResource(data: File | File[], maxSize?: string): Observable<any> {
        return from(this.uploadService.uploadBinaryFile(data, () => {}, maxSize));
    }
}
