import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, ApplicationRef } from '@angular/core';

/*
 * Platform and Environment providers/directives/pipes
 */
// App is our top level component
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*
 * Custom Components
 */
import { COMPONENTS, DIRECTIVES, PIPES } from './components';

import { ENV_PROVIDERS } from './environment';

import { NGFACES_MODULES } from './modules';
import { ActionButtonModule } from './view/components/_common/action-button/action-button.module';
import { FieldValidationMessageModule } from './view/components/_common/field-validation-message/file-validation-message.module';
import { ListingDataTableModule } from './view/components/listing-data-table/listing-data-table.module';
import { SiteSelectorModule } from './view/components/_common/site-selector/site-selector.module';
import { SearchableDropDownModule } from './view/components/_common/searchable-dropdown';

// import { DotcmsTreeableDetailModule } from '../dotcms-js/components/treeable-detail/treeable-detail.component';
// import { DotcmsSiteDatatableModule } from '../dotcms-js/components/site-datatable/site-datatable.component';
// import { DotcmsSiteTreeTableModule } from '../dotcms-js/components/site-treetable/site-treetable.component';
// import { DotcmsBreadcrumbModule } from '../dotcms-js/components/breadcrumb/breadcrumb.component';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, ...PIPES, ...COMPONENTS, ...DIRECTIVES],
    imports: [
        // import Angular's modules
        ...NGFACES_MODULES,
        ActionButtonModule,
        BrowserAnimationsModule,
        BrowserModule,
        BrowserModule,
        FieldValidationMessageModule,
        FieldValidationMessageModule,
        FormsModule,
        FormsModule,
        HttpModule,
        HttpModule,
        JsonpModule,
        JsonpModule,
        ListingDataTableModule,
        ListingDataTableModule,
        ReactiveFormsModule,
        SearchableDropDownModule,
        SiteSelectorModule,
        // DotcmsTreeableDetailModule,
        // DotcmsSiteDatatableModule,
        // DotcmsSiteTreeTableModule,
        // DotcmsBreadcrumbModule,
        // AppRoutingModule should always be the last one
        AppRoutingModule
    ],
    providers: [
        ENV_PROVIDERS
    ]
})
export class AppModule {}
