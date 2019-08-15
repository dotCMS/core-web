import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogModule, TooltipModule, ButtonModule, CheckboxModule } from 'primeng/primeng';

import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { DotDOMHtmlUtilService } from './services/html/dot-dom-html-util.service';
import { DotDirectivesModule } from '@shared/dot-directives.module';
import { DotDragDropAPIHtmlService } from './services/html/dot-drag-drop-api-html.service';
import { DotEditContentComponent } from './dot-edit-content.component';
import { DotEditContentHtmlService } from './services/dot-edit-content-html/dot-edit-content-html.service';
import { DotEditContentToolbarHtmlService } from './services/html/dot-edit-content-toolbar-html.service';
import { DotLoadingIndicatorModule } from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.module';
import { DotPageRenderService } from '@services/dot-page-render/dot-page-render.service';
import { DotWorkflowService } from '@services/dot-workflow/dot-workflow.service';
import { DotEditPageService } from '@services/dot-edit-page/dot-edit-page.service';
import { DotWhatsChangedModule } from './components/dot-whats-changed/dot-whats-changed.module';

import { DotFormSelectorModule } from './components/dot-form-selector/dot-form-selector.module';
import { DotContentletEditorModule } from '@components/dot-contentlet-editor/dot-contentlet-editor.module';
import { DotEditPageInfoModule } from '../components/dot-edit-page-info/dot-edit-page-info.module';
import { DotEditPageWorkflowsActionsModule } from './components/dot-edit-page-workflows-actions/dot-edit-page-workflows-actions.module';
import { DotGlobalMessageModule } from '@components/_common/dot-global-message/dot-global-message.module';
import { DotEditToolbarModule } from '../main/dot-edit-toolbar/dot-edit-toolbar.module';
import { DotEditPageViewAsControllerModule } from './components/dot-edit-page-view-as-controller/dot-edit-page-view-as-controller.module';
import { DotEditPageStateControllerModule } from './components/dot-edit-page-state-controller/dot-edit-page-state-controller.module';

const routes: Routes = [
    {
        component: DotEditContentComponent,
        path: ''
    }
];

@NgModule({
    declarations: [DotEditContentComponent],
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        CheckboxModule,
        RouterModule.forChild(routes),
        DotContentletEditorModule,
        DotDirectivesModule,
        DotEditPageWorkflowsActionsModule,
        DotWhatsChangedModule,
        DotFormSelectorModule,
        TooltipModule,
        DotContentletEditorModule,
        DotEditPageInfoModule,
        DotLoadingIndicatorModule,
        DotGlobalMessageModule,
        DotEditToolbarModule,
        DotEditPageViewAsControllerModule,
        DotEditPageStateControllerModule
    ],
    exports: [DotEditContentComponent],
    providers: [
        DotContainerContentletService,
        DotDOMHtmlUtilService,
        DotDragDropAPIHtmlService,
        DotEditContentHtmlService,
        DotEditContentToolbarHtmlService,
        DotEditPageService,
        DotPageRenderService,
        DotWorkflowService
    ]
})
export class DotEditContentModule {}
