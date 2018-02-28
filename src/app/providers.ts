import { AccountService } from './api/services/account-service';
import { AuthGuardService } from './api/services/guards/auth-guard.service';
import { ColorUtil } from './api/util/ColorUtil';
import { ConfirmationService } from 'primeng/primeng';
import { ContentTypesInfoService } from './api/services/content-types-info';
import { ContentletGuardService } from './api/services/guards/contentlet-guard.service';
import { CrudService } from './api/services/crud/crud.service';
import { DefaultGuardService } from './api/services/guards/default-guard.service';
import { DotConfirmationService } from './api/services/dot-confirmation';
import { DotInterceptor } from './api/services/dot-interceptor/dot-interceptor.service';
import { DotMenuService } from './api/services/dot-menu.service';
import { DotRouterService } from './api/services/dot-router/dot-router.service';
import { DotMessageService } from './api/services/dot-messages-service';
import { FormatDateService } from './api/services/format-date-service';
import { GravatarService } from './api/services/gravatar-service';
import { IframeOverlayService } from './view/components/_common/iframe/service/iframe-overlay.service';
import { Logger } from 'angular2-logger/core';
import { MenuGuardService } from './api/services/guards/menu-guard.service';
import { NotLicensedService } from './api/services/not-licensed-service';
import { NotificationsService } from './api/services/notifications-service';
import { PaginatorService } from './api/services/paginator';
import { PublicAuthGuardService } from './api/services/guards/public-auth-guard.service';
import { StringFormat } from './api/util/stringFormat';

const PROVIDERS: any[] = [
    AccountService,
    AuthGuardService,
    ColorUtil,
    ConfirmationService,
    ContentTypesInfoService,
    ContentletGuardService,
    CrudService,
    DefaultGuardService,
    DotConfirmationService,
    DotInterceptor,
    DotMenuService,
    DotMessageService,
    DotRouterService,
    FormatDateService,
    GravatarService,
    IframeOverlayService,
    Logger,
    MenuGuardService,
    NotLicensedService,
    NotificationsService,
    PaginatorService,
    PublicAuthGuardService,
    StringFormat
];

export const ENV_PROVIDERS = [...PROVIDERS];
