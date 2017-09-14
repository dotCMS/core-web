// CUSTOM COMPONENTS
import { Accordion, AccordionGroup } from './view/components/_common/accordion/accordion';
import { CustomTimeComponent } from './view/components/_common/custom-time/custom-time';
import { DotLoadingIndicatorComponent } from './view/components/_common/dot-loading-indicator/dot-loading-indicator.component';
import { GlobalSearch } from './view/components/global-search/global-search';
import { IframeLegacyComponent } from './view/components/iframe-legacy/iframe-legacy-component';
import { LogOutContainer } from './view/components/login/login-component/log-out-container';
import { LoginAsComponent } from './view/components/login-as/login-as';
import { LoginPageComponent } from './view/components/login/login-page-component';
import { MainComponentLegacy } from './view/components/main-legacy/main-legacy.component';
import { MainCoreLegacyComponent } from './view/components/main-core-legacy/main-core-legacy-component';
import { MainNavigation } from './view/components/main-navigation/main-navigation';
import { MyAccountComponent } from './view/components/my-account/dot-my-account-component';
import { NotificationsList, NotificationsItem } from './view/components/_common/notifications/notifications';
import { ResetPasswordComponent } from './view/components/login/reset-password-component/reset-password-component';
import { ResetPasswordContainer } from './view/components/login/reset-password-component/reset-password-container';
import { ToolbarNotifications } from './view/components/toolbar-notifications/toolbar-notifications';
import { ToolbarUserComponent } from './view/components/toolbar-user/toolbar-user';
import { ToolbarComponent } from './view/components/toolbar/toolbar.component';

export const COMPONENTS = [
    Accordion,
    AccordionGroup,
    CustomTimeComponent,
    DotLoadingIndicatorComponent,
    GlobalSearch,
    IframeLegacyComponent,
    LogOutContainer,
    LoginAsComponent,
    LoginPageComponent,
    MainComponentLegacy,
    MainCoreLegacyComponent,
    MainNavigation,
    MyAccountComponent,
    NotificationsItem,
    NotificationsList,
    ResetPasswordComponent,
    ResetPasswordContainer,
    ToolbarAddContenletBodyComponent,
    ToolbarAddContenletComponent,
    ToolbarComponent,
    ToolbarNotifications,
    ToolbarUserComponent
];

// CUSTOM PIPES
import { CapitalizePipe } from './api/pipes/capitalize-pipe';

export const PIPES = [
    CapitalizePipe
];

import {
    ToolbarAddContenletBodyComponent,
    ToolbarAddContenletComponent
} from './view/components/toolbar-add-contentlet/toolbar-add-contentlet';
