import { DotCMSHttpClient } from '../utils/DotCMSHttpClient';
import { DotCMSContent, DotCMSContentQuery, DotCMSError } from '../models';

function populateQueryUrl(params: DotCMSContentQuery): string {
    let url = '';

    const attrs = {
        depth: `/depth/${params.depth}`,
        limit: `/limit/${params.limit}`,
        offset: `/offset/${params.offset}`,
        orderBy: `/orderby/${params.orderBy}`
    };

    for (const key of Object.keys(params)) {
        url += key !== 'query' ? attrs[key] : '';
    }

    return url;
}

/**
 * Save/Publish the information of DotCMS Content
 *
 */
export class DotApiContent {
    private dotCMSHttpClient: DotCMSHttpClient;

    constructor(httpClient: DotCMSHttpClient) {
        this.dotCMSHttpClient = httpClient;
    }

    query(params: DotCMSContentQuery): Promise<Response> {
        let url = `/api/content/query/${params.query}`;
        url += populateQueryUrl(params);
        return this.doRequest(url);
    }

    save<Content extends DotCMSContent>(params: Content): Promise<Response> {
        return this.doRequest('/api/content/save/1', params);
    }

    publish<Content extends DotCMSContent>(params: Content): Promise<Response> {
        return this.doRequest('/api/content/publish/1', params);
    }

    private async doRequest<Content extends DotCMSContent>(
        url: string,
        params?: Content
    ): Promise<Response> {
        const response = await this.dotCMSHttpClient.request({
            url,
            method: params ? 'POST' : 'GET',
            body: params ? JSON.stringify(params) : ''
        });

        if (response.status !== 200) {
            throw <DotCMSError>{
                message: await response.text(),
                statusCode: response.status
            };
        }

        return response;
    }
}
