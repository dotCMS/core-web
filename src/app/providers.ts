import { AccountService } from './api/services/account-service';
import { ColorUtil } from './api/util/ColorUtil';
import { ConfirmationService } from 'primeng/primeng';
import { ContentTypesInfoService } from './api/services/content-types-info';
import { CrudService } from './api/services/crud/crud.service';
import { DotMenuService } from './api/services/dot-menu.service';
import { DotRouterService } from './api/services/dot-router-service';
import { FormatDateService } from './api/services/format-date-service';
import { GravatarService } from './api/services/gravatar-service';
import { IframeOverlayService } from './api/services/iframe-overlay-service';
import { Logger } from 'angular2-logger/core';
import { MessageService } from './api/services/messages-service';
import { NotLicensedService } from './api/services/not-licensed-service';
import { NotificationsService } from './api/services/notifications-service';
import { PaginatorService } from './api/services/paginator';
import { AuthGuardService } from './api/services/guards/auth-guard.service';
import { ContentletGuardService} from './api/services/guards/contentlet-guard.service';
import { MenuGuardService } from './api/services/guards/menu-guard.service';
import { PublicAuthGuardService } from './api/services/guards/public-auth-guard.service';
import { StringFormat } from './api/util/stringFormat';
import { DotConfirmationService } from './api/services/dot-confirmation';


const PROVIDERS: any[] = [
    // common env directives
    AccountService,
    ColorUtil,
    ConfirmationService,
    ContentTypesInfoService,
    CrudService,
    DotMenuService,
    DotRouterService,
    FormatDateService,
    GravatarService,
    IframeOverlayService,
    Logger,
    MessageService,
    NotLicensedService,
    DotConfirmationService,
    NotificationsService,
    PaginatorService,
    AuthGuardService,
    ContentletGuardService,
    MenuGuardService,
    PublicAuthGuardService,
    StringFormat,
];

export const ENV_PROVIDERS = [...PROVIDERS];
