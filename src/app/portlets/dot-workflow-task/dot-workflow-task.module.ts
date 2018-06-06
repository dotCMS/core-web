import { CommonModule } from '@angular/common';

import { DotContainerContentletService } from '../../../app/portlets/dot-edit-page/content/services/dot-container-contentlet.service';
import { DotDragDropAPIHtmlService } from '../../../app/portlets/dot-edit-page/content/services/html/dot-drag-drop-api-html.service';
import { DotDOMHtmlUtilService } from '../../../app/portlets/dot-edit-page/content/services/html/dot-dom-html-util.service';
import { DotEditContentToolbarHtmlService } from '../dot-edit-page/content/services/html/dot-edit-content-toolbar-html.service';

import { DotWorkflowTaskComponent } from './dot-workflow-task.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        component: DotWorkflowTaskComponent,
        path: ''
    }
];

@NgModule({
    declarations: [DotWorkflowTaskComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: [
        DotContainerContentletService,
        DotDragDropAPIHtmlService,
        DotDOMHtmlUtilService,
        DotEditContentToolbarHtmlService
    ]
})
export class DotWorkflowTaskModule {}
