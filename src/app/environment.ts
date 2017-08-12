// Angular 2
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';

import { AccountService } from './api/services/account-service';
import { ApiRoot } from './api/persistence/ApiRoot';
import { BrowserUtil } from './api/util/browser-util';
import { BundleService } from './api/services/bundle-service';
import { ColorUtil } from './api/util/ColorUtil';
import { Config } from './api/util/config';
import { ConfirmationService } from 'primeng/primeng';
import { ContentTypesInfoService } from './api/services/content-types-info';
import { CoreWebService } from './api/services/core-web-service';
import { CrudService } from './api/services/crud/crud.service';
import { DotRouterService } from './api/services/dot-router-service';
import { DotcmsConfig } from './api/services/system/dotcms-config';
import { DotcmsEventsService } from './api/services/dotcms-events-service';
import { FormatDateService } from './api/services/format-date-service';
import { GravatarService } from './api/services/gravatar-service';
import { IframeOverlayService } from './api/services/iframe-overlay-service';
import { Logger } from 'angular2-logger/core';
import { LoggerService } from './api/services/logger.service';
import { LoginService } from './api/services/login-service';
import { MessageService } from './api/services/messages-service';
import { NotLicensedService } from './api/services/not-licensed-service';
import { NotificationsService } from './api/services/notifications-service';
import { RoutingPrivateAuthService } from './api/services/routing-private-auth-service';
import { RoutingPublicAuthService } from './api/services/routing-public-auth-service';
import { RoutingService } from './api/services/routing-service';

import { SiteService } from './api/services/site-service';
import { SocketFactory } from './api/services/protocol/socket-factory';
import { StringFormat } from './api/util/stringFormat';
import { StringUtils } from './api/util/string.utils';
import { UserModel } from './api/auth/UserModel';


// import { AppConfig } from '../dotcms-js/core/app.config';
// import { FileService } from '../dotcms-js/core/util/file.services';
// import { HttpClient } from '../dotcms-js/core/util/http.service';
// import { LocalStoreService } from '../dotcms-js/core/util/local-store.service';
// import { LoggerService as LoggerServiceDotJS } from '../dotcms-js/core/util/logger.service';
// import { NotificationService as NotificationsServiceDotJS } from '../dotcms-js/core/util/notification.service';
// import { SettingsStorageService } from '../dotcms-js/core/util/settings-storage.service';
// import { SiteBrowserService } from '../dotcms-js/core/util/site-browser.service';
// import { SiteBrowserState } from '../dotcms-js/core/util/site-browser.state';
// import { SiteSelectorService } from '../dotcms-js/components/site-selector/site-selector.service';
// import { SiteTreetableService } from '../dotcms-js/components/site-treetable/site-treetable.service';

// ROUTING
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PaginatorService } from './api/services/paginator';
import { environment } from '../environments/environment';



let PROVIDERS: any[] = [
    // common env directives
    AccountService,
    ApiRoot,
    BrowserUtil,
    BundleService,
    ColorUtil,
    Config,
    CoreWebService,
    ConfirmationService,
    ContentTypesInfoService,
    CrudService,
    DotRouterService,
    DotcmsConfig,
    DotcmsEventsService,
    FormatDateService,
    GravatarService,
    IframeOverlayService,
    Logger,
    LoggerService,
    LoginService,
    MessageService,
    NotLicensedService,
    NotificationsService,
    PaginatorService,
    RoutingPrivateAuthService,
    RoutingPublicAuthService,
    RoutingService,
    SiteService,
    SocketFactory,
    StringFormat,
    StringUtils,
    UserModel,
    ColorUtil,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: SettingsStorageService, useClass: SettingsStorageService },
    // { provide: HttpClient, useClass: HttpClient },
    // { provide: SiteSelectorService, useClass: SiteSelectorService },
    // { provide: SiteBrowserService, useClass: SiteBrowserService },
    // { provide: NotificationsServiceDotJS, useClass: NotificationsServiceDotJS },
    // { provide: AppConfig, useValue: AppConfig },
    // { provide: SiteBrowserState, useClass: SiteBrowserState },
    // { provide: SiteTreetableService, useClass: SiteTreetableService },
    // { provide: LoggerServiceDotJS, useClass: LoggerServiceDotJS },
    // { provide: LocalStoreService, useClass: LocalStoreService },
    // { provide: FileService, useClass: FileService },
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = <T>(value: T): T => {
    return value;
};

// if ('production' === ENV) {
if ('production' === environment.name) {
    enableProdMode();

    // Production
    _decorateModuleRef = (modRef: any) => {
        disableDebugTools();

        return modRef;
    };

    PROVIDERS = [
        ...PROVIDERS
        // custom providers in production
    ];
} else {
    _decorateModuleRef = (modRef: any) => {
        const appRef = modRef.injector.get(ApplicationRef);
        const cmpRef = appRef.components[0];

        const _ng = (<any>window).ng;
        enableDebugTools(cmpRef);
        (<any>window).ng.probe = _ng.probe;
        (<any>window).ng.coreTokens = _ng.coreTokens;
        return modRef;
    };

    // Development
    PROVIDERS = [
        ...PROVIDERS
        // custom providers in development
    ];
}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [...PROVIDERS];
