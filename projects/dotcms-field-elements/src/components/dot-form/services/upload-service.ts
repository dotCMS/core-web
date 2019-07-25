import { DotTempFile } from '../../../models';

export class UploadService {
    constructor() {}

    uploadFile(file: string | File): Promise<DotTempFile | string> {
        if (typeof file === 'string') {
            return this.uploadFileByURL(file);
        } else {
            return this.uploadBinaryFile(file);
        }
    }

    private uploadFileByURL(url: string): Promise<DotTempFile | string> {
        const UPLOAD_FILE_FROM_URL = 'http://localhost:8080/api/v1/temp/byUrl';

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
                return response.json().then(json => {
                    return json.tempFiles[0];
                });
            } else {
                return response.json().then(json => {
                    return json.message;
                });
            }
        });
    }

    private uploadBinaryFile(file: File): Promise<DotTempFile | string> {
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
                return response.json().then(json => {
                    return json.tempFiles[0];
                });
            } else {
                return response.json().then(json => {
                    return json.message;
                });
            }
        });
    }
}
