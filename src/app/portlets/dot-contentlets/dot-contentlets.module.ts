import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DotContentletsComponent } from './dot-contentlets-component';

import { AutoCompleteModule, DialogModule, FileUploadModule } from 'primeng/primeng';
import {
    DotBreadcrumbHostselectorModule,
    DotBreadcrumbModule,
    DotFileModule,
    DotFolderModule,
    DotHttpModule,
    DotNotificationModule,
    DotSettingsStorageModule,
    DotSiteBrowserModule,
    DotSiteDatagridModule,
    DotSiteDatatableModule,
    DotSiteSelectorModule,
    DotSiteTreeTableModule,
    DotTreeableDetailModule
} from 'dotcms-js/dotcms-js';
import { Routes, RouterModule } from '@angular/router';
import { DotDirectivesModule } from '../../shared/dot-directives.module';

const routes: Routes = [
    {
        component: DotContentletsComponent,
        path: ''
    }
];

@NgModule({
    declarations: [DotContentletsComponent],
    imports: [
        AutoCompleteModule,
        CommonModule,
        DotBreadcrumbModule,
        DotFileModule,
        DotFolderModule,
        DotHttpModule,
        DotNotificationModule,
        DotSettingsStorageModule,
        DotSiteBrowserModule,
        DotSiteDatatableModule,
        DotSiteDatagridModule,
        DotSiteSelectorModule,
        DotSiteTreeTableModule,
        DotTreeableDetailModule,
        DotBreadcrumbHostselectorModule,
        FormsModule,
        DialogModule,
        FileUploadModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        DotDirectivesModule
    ],
    exports: [],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class DotContentletsModule {}
