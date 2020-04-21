import { request } from './request';
import { DotCMSConfigurationParams, DotAppHttpRequestParams } from '../models';

export class DotCMSHttpClient {
    private _config: DotCMSConfigurationParams;

    constructor(config: DotCMSConfigurationParams) {
        this._config = config;
    }

    public request(params: DotAppHttpRequestParams) {
        return request(params, this._config);
    }
}
