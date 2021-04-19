import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AppComponent } from './app.component';
import { 
    CoreWebService, 
    DotcmsConfigService, 
    DotcmsEventsService, 
    DotEventsSocket, 
    DotEventsSocketURL, 
    LoggerService, 
    LoginService, 
    SiteService, 
    StringUtils 
} from '@dotcms/dotcms-js';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DotIconModule } from '@dotcms/ui';
import { DotCDNService } from './dotcdn.service';
import { FormsModule } from '@angular/forms';


const dotEventSocketURLFactory = () => {
    return new DotEventsSocketURL(
        `${window.location.hostname}:${window.location.port}/api/ws/v1/system/events`,
        window.location.protocol === 'https:'
    );
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        InputTextModule,
        DropdownModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot([]),
        TabViewModule,
        ChartModule,
        InputTextareaModule,
        ButtonModule,
        DotIconModule,
        FormsModule
    ],
    providers: [
        CoreWebService,
        LoggerService,
        StringUtils,
        SiteService,
        DotCDNService,
        LoginService,
        DotEventsSocket,
        DotcmsEventsService,
        { provide: DotEventsSocketURL, useFactory: dotEventSocketURLFactory },
        DotcmsConfigService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
