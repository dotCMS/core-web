import { DotCMSHttpClient } from '../utils/DotCMSHttpClient';
import { DotCMSContentType, DotCMSContent, DotCMSContentTypeField, DotCMSError } from '../models';

/**
 * Get the information of DotCMS contentTypes
 *
 */
export class DotApiContentType {
    private dotCMSHttpClient: DotCMSHttpClient;

    constructor(httpClient: DotCMSHttpClient) {
        this.dotCMSHttpClient = httpClient;
    }

    get(contentTypeId): Promise<DotCMSContentType> {
        return this.dotCMSHttpClient
            .request({
                url: `/api/v1/contenttype/id/${contentTypeId}`
            })
            .then(async (response: Response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    return data.entity;
                }

                throw <DotCMSError>{
                    message: await response.text(),
                    status: response.status
                };
            });
    }

    getFields(contentTypeId): Promise<DotCMSContentTypeField[]> {
        return this.get(contentTypeId).then((contentType: DotCMSContentType) => {
            return contentType.fields;
        });
    }

    save<Content extends DotCMSContent>(params: Content): Promise<Response> {
        return this.dotCMSHttpClient
            .request({
                url: `/api/content/save/1`,
                method: 'POST',
                body: JSON.stringify(params)
            })
            .then(async (response: Response) => {
                if (response.status === 200) {
                    return null;
                }

                throw <DotCMSError>{
                    message: await response.text(),
                    status: response.status
                };
            });
    }

    publish<Content extends DotCMSContent>(params: Content): Promise<Response> {
        return this.dotCMSHttpClient
            .request({
                url: `/api/content/publish/1`,
                method: 'POST',
                body: JSON.stringify(params)
            })
            .then(async (response: Response) => {
                if (response.status === 200) {
                    return null;
                }

                throw <DotCMSError>{
                    message: await response.text(),
                    status: response.status
                };
            });
    }
}
