import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ApiRoot,
    BrowserUtil,
    CoreWebService,
    DotcmsConfig,
    DotcmsEventsService,
    LoggerService,
    LoginService,
    SiteService,
    StringUtils,
    UserModel,
    DotEventsSocket
} from 'dotcms-js';

// Common Modules
import { DotDropdownModule } from '@components/_common/dropdown-component/dot-dropdown.module';
import { GravatarModule } from '@components/_common/gravatar/gravatar.module';
import { MainNavigationModule } from '@components/dot-navigation/dot-navigation.module';
import { DotEventsService } from '../api/services/dot-events/dot-events.service';
import { DotNavigationService } from '@components/dot-navigation/services/dot-navigation.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, DotDropdownModule, GravatarModule, MainNavigationModule],
    exports: [
        CommonModule,
        // Common Modules
        DotDropdownModule,
        GravatarModule,
        MainNavigationModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ApiRoot,
                BrowserUtil,
                CoreWebService,
                DotEventsService,
                DotNavigationService,
                DotcmsConfig,
                DotcmsEventsService,
                LoggerService,
                LoginService,
                SiteService,
                DotEventsSocket,
                StringUtils,
                UserModel
            ]
        };
    }
}
