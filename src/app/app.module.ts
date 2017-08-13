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
import { RuleEngineModule } from './portlets/rule-engine/rule-engine.module';
import { DotBrowserModule } from './portlets/dot-browser/dot-browser.module';

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
        FieldValidationMessageModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ListingDataTableModule,
        ReactiveFormsModule,
        SearchableDropDownModule,
        SiteSelectorModule,
        RuleEngineModule,
        DotBrowserModule,
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
