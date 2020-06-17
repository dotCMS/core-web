import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js';
import { Headers } from '@angular/http';

@Injectable()
export class DotFileUploadService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Uploads a file into "/api/v1/temp"
     *
     * @param {File} file
     * @returns {Observable<any>}
     * @memberof DotFileUploadService
     */
    upload(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        const headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');

        return this.coreWebService.requestView({
            headers,
            body: formData,
            method: RequestMethod.Post,
            url: `/api/v1/temp`
        });
    }
}
