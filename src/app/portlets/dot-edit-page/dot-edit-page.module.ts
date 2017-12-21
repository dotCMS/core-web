import { PageViewResolver } from './dot-edit-page-resolver.service';
import { PageViewService } from './../../api/services/page-view/page-view.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageRoutingModule } from './dot-edit-page-routing.module';
import { DotEditLayoutModule } from './layout/dot-edit-layout/dot-edit-layout.module';
import { DotTemplateAdditionalActionsModule } from './layout/dot-template-additional-actions/dot-template-additional-actions.module';
import { TemplateContainersCacheService } from './template-containers-cache.service';
import { DotEditContentModule } from '../dot-edit-content/dot-edit-content.module';
import { EditContentResolver } from '../dot-edit-content/services/dot-edit-content-resolver.service';
import { DotEditPageComponent } from './dot-edit-page.component';

@NgModule({
    imports: [
        CommonModule,
        DotEditPageRoutingModule,
        DotEditLayoutModule,
        DotTemplateAdditionalActionsModule,
        DotEditContentModule
    ],
    declarations: [DotEditPageComponent],
    providers: [PageViewService, PageViewResolver, TemplateContainersCacheService, EditContentResolver]
})
export class DotEditPageModule {}
