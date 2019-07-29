import { DotTempFile } from '../../../models';
import { DotHttpErrorResponse } from '../../../models/dot-http-error-response.model';

export class DotUploadService {
    constructor() {}

    uploadFile(file: string | File): Promise<DotTempFile> {
        if (typeof file === 'string') {
            return this.uploadFileByURL(file);
        } else {
            return this.uploadBinaryFile(file);
        }
    }

    private uploadFileByURL(url: string): Promise<DotTempFile> {
        const UPLOAD_FILE_FROM_URL = '/api/v1/temp/byUrl';
        debugger;
        return fetch(UPLOAD_FILE_FROM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Origin: window.location.hostname
            },
            body: JSON.stringify({
                remoteUrl: url
            })
        }).then(async (response: Response) => {
            if (response.status === 200) {
                debugger;
                return (await response.json()).tempFiles[0];
            } else {
                const error: DotHttpErrorResponse = {
                    message: (await response.json()).message,
                    status: response.status
                };
                throw error;
            }
        });
    }

    private uploadBinaryFile(file: File): Promise<DotTempFile> {
        const UPLOAD_FILE = 'http://localhost:8080/api/v1/temp';

        const formData = new FormData();
        formData.append('file', file);
        return fetch(UPLOAD_FILE, {
            method: 'POST',
            headers: {
                Origin: window.location.hostname
            },
            body: formData
        }).then(async (response: Response) => {
            if (response.status === 200) {
                return (await response.json()).tempFiles[0];
            } else {
                const error: DotHttpErrorResponse = {
                    message: (await response.json()).message,
                    status: response.status
                };
                throw error;
            }
        });
    }
}
