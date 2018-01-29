import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogModule } from 'primeng/primeng';

import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { DotDOMHtmlUtilService } from './services/html/dot-dom-html-util.service';
import { DotDragDropAPIHtmlService } from './services/html/dot-drag-drop-api-html.service';
import { DotEditContentComponent } from './dot-edit-content.component';
import { DotEditContentHtmlService } from './services/dot-edit-content-html.service';
import { DotEditContentToolbarHtmlService } from './services/html/dot-edit-content-toolbar-html.service';
import { DotEditPageToolbarModule } from './components/dot-edit-page-toolbar/dot-edit-page-toolbar.module';
import { EditContentResolver } from './services/dot-edit-content-resolver.service';
import { EditPageService } from '../../api/services/edit-page/edit-page.service';
import { DotLoadingIndicatorModule } from '../../view/components/_common/iframe/dot-loading-indicator/dot-loading-indicator.module';
import { WorkflowService } from '../../api/services/workflow/workflow.service';

const routes: Routes = [
    {
        component: DotEditContentComponent,
        path: '',
        resolve: {
            renderedPage: EditContentResolver
        }
    }
];

@NgModule({
    declarations: [DotEditContentComponent],
    imports: [
        CommonModule,
        DialogModule,
        RouterModule.forChild(routes),
        DotEditPageToolbarModule,
        DotLoadingIndicatorModule
    ],
    exports: [DotEditContentComponent],
    providers: [
        DotContainerContentletService,
        DotDOMHtmlUtilService,
        DotDragDropAPIHtmlService,
        DotEditContentHtmlService,
        DotEditContentToolbarHtmlService,
        EditContentResolver,
        EditPageService,
        WorkflowService
    ]
})
export class DotEditContentModule {}
