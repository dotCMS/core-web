import { Injectable } from '@angular/core';
import { DotAssetService, DotUploadService } from '@dotcms/utils';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
        const files = Array.isArray(data) ? data : [data];
        return this.setTempResource(data, progressCallBack, maxSize).pipe(
            take(1),
            map((data) => {
                return from(
                    this.assetService.create({
                        files: files,
                        updateCallback: (filesCreated: number) => {
                            console.log('updateCallback');
                            // progressCallBack(files.length, filesCreated);
                        },
                        url: 'http://localhost:8080/api/v1/workflow/actions/default/fire/PUBLISH',
                        folder: ''
                    })
                );
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
