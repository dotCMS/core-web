import { DotApiAuthorization } from './lib/api/DotApiAuthorization';
import { DotApiConfiguration } from './lib/api/DotApiConfiguration';
import { DotApiElasticSearch } from './lib/api/DotApiElasticSearch';
import { DotApiEvent } from './lib/api/DotApiEvent';
import { DotApiLanguage } from './lib/api/DotApiLanguage';
import { DotApiNavigation } from './lib/api/DotApiNavigation';
import { DotApiPage } from './lib/api/DotApiPage';
import { DotApiSite } from './lib/api/DotApiSite';
import { DotApiWidget } from './lib/api/DotApiWidget';
import { DotCMSHttpClient } from './lib/utils/DotCMSHttpClient';
import { DotCMSConfigurationParams } from './lib/models';
import { DotApiContentType } from './lib/api/DotApiContentType';

export interface DotCMSApp {
    auth: DotApiAuthorization;
    contentType: DotApiContentType;
    esSearch: DotApiElasticSearch;
    event: DotApiEvent;
    nav: DotApiNavigation;
    page: DotApiPage;
    site: DotApiSite;
    widget: DotApiWidget;
    config: DotApiConfiguration;
    language: DotApiLanguage;
    httpClient: DotCMSHttpClient;
}

export const initDotCMS = (config: DotCMSConfigurationParams): DotCMSApp => {
    const httpClient = new DotCMSHttpClient(config);
    const apiConfig = new DotApiConfiguration(httpClient);
    const apiLanguage = new DotApiLanguage(apiConfig);

    return {
        auth: new DotApiAuthorization(),
        config: apiConfig,
        contentType: new DotApiContentType(httpClient),
        esSearch: new DotApiElasticSearch(httpClient),
        event: new DotApiEvent(),
        language: apiLanguage,
        nav: new DotApiNavigation(httpClient),
        page: new DotApiPage(httpClient, apiLanguage),
        site: new DotApiSite(httpClient),
        widget: new DotApiWidget(httpClient),
        httpClient: httpClient
    };
};
