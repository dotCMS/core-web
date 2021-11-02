import {
    DotCMSContentlet,
    DotCMSTempFile,
    DotAssetCreateOptions,
    DotHttpErrorResponse
} from '@dotcms/dotcms-models';
import { fallbackErrorMessages } from '../dot-upload/dot-upload.service';

export class DotAssetService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    /**
     * Create DotAssets based on options passed in DotAssetCreateOptions
     * @param options
     *
     * @memberof DotAssetService
     */
    create(options: DotAssetCreateOptions): Promise<DotCMSContentlet[] | DotHttpErrorResponse[]> {
        const promises = [];
        let filesCreated = 1;
        options.files.map((file: DotCMSTempFile) => {
            const data = {
                contentlet: {
                    baseType: 'dotAsset',
                    asset: file.id,
                    hostFolder: options.folder,
                    indexPolicy: 'WAIT_FOR'
                }
            };
            promises.push(
                this.fetchAsset(options.url, data)
                    .then((response: Response) => {
                        options.updateCallback(filesCreated++);
                        return response;
                    })
                    .catch((e) => e)
            );
        });

        return Promise.all(promises).then(async (response: Response[]) => {
            const errors: DotHttpErrorResponse[] = [];
            const data: DotCMSContentlet[] = [];
            for (const res of response) {
                const responseData = await res.json();
                data.push(responseData.entity);
                if (res.status !== 200) {
                    let message = '';
                    try {
                        message = responseData.message || responseData.errors[0].message;
                    } catch {
                        message = fallbackErrorMessages[res.status];
                    }
                    errors.push({
                        message: message,
                        status: res.status
                    });
                }
            }

            if (errors.length) {
                throw errors;
            } else {
                return data;
            }
        });
    }

    fetchAsset(url, data): Promise<Response> {
        return fetch(url, {
            method: 'PUT',
            headers: {
                Origin: window.location.hostname,
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: 'Basic YWRtaW5AZG90Y21zLmNvbTphZG1pbg=='
            },
            body: JSON.stringify(data)
        });
    }
}