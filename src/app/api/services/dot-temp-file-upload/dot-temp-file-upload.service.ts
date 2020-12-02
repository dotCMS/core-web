import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { pluck, catchError, take, map } from 'rxjs/operators';

export interface DotCMSTempFile {
    fileName: string;
    folder: string;
    id: string;
    image: boolean;
    length: number;
    mimeType: string;
    referenceUrl: string;
    thumbnailUrl: string;
}

@Injectable()
export class DotTempFileUploadService {
    constructor(
        private coreWebService: CoreWebService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService
    ) {}

    /**
     * Upload file to the dotcms temp service
     *
     * @param {File} file
     * @returns {(Observable<DotCMSTempFile | string>)}
     * @memberof DotTempFileUploadService
     */
    upload(file: File): Observable<DotCMSTempFile[] | string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.coreWebService
            .requestView<DotCMSTempFile[]>({
                url: `/api/v1/temp`,
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                method: 'POST'
            })
            .pipe(
                pluck('tempFiles'),
                catchError((error: HttpErrorResponse) => {
                    return this.dotHttpErrorManagerService.handle(error).pipe(
                        take(1),
                        map((err) => err.status.toString())
                    );
                })
            );
    }
}
