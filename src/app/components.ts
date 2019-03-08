import { CustomTimeComponent } from './view/components/_common/custom-time/custom-time';
import { DotAlertConfirmComponent } from './view/components/_common/dot-alert-confirm/dot-alert-confirm';
import { GlobalSearchComponent } from './view/components/global-search/global-search';
import { DotLogOutContainerComponent } from '@components/login/dot-login-component/dot-log-out-container';
import { LoginAsComponent } from './view/components/login-as/login-as';
import { LoginPageComponent } from './view/components/login/login-page-component';
import { MainComponentLegacyComponent } from './view/components/main-legacy/main-legacy.component';
import { MainCoreLegacyComponent } from './view/components/main-core-legacy/main-core-legacy-component';
import { MyAccountComponent } from './view/components/my-account/dot-my-account-component';
import {
    NotificationsListComponent,
    NotificationsItemComponent
} from './view/components/_common/notifications/notifications';
import { ToolbarComponent } from './view/components/dot-toolbar/dot-toolbar.component';
import { ToolbarNotificationsComponent } from './view/components/toolbar-notifications/toolbar-notifications';
import { ToolbarUserComponent } from './view/components/toolbar-user/toolbar-user';

// CUSTOM PIPES
import { CapitalizePipe, SafePipe } from './view/pipes/index';

export const COMPONENTS = [
    ToolbarUserComponent,
    ToolbarNotificationsComponent,
    ToolbarComponent,
    NotificationsListComponent,
    NotificationsItemComponent,
    MyAccountComponent,
    MainCoreLegacyComponent,
    MainComponentLegacyComponent,
    LoginPageComponent,
    LoginAsComponent,
    DotLogOutContainerComponent,
    GlobalSearchComponent,
    DotAlertConfirmComponent,
    CustomTimeComponent
];

export const PIPES = [CapitalizePipe, SafePipe];
