import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateCreateEditComponent } from './dot-template-create-edit.component';
import { DotTemplateCreateEditRoutingModule } from './dot-template-create-edit-routing.module';
import { DotTemplateDesignerModule } from './dot-template-designer/dot-template-designer.module';
import { TabViewModule } from 'primeng/tabview';
import { DotPortletBaseModule } from '@components/dot-portlet-base/dot-portlet-base.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DotApiLinkModule } from '@components/dot-api-link/dot-api-link.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        DotTemplateCreateEditRoutingModule,
        DotTemplateDesignerModule,
        TabViewModule,
        DotPortletBaseModule,
        DynamicDialogModule,
        DotApiLinkModule,
        ButtonModule
    ],
    declarations: [DotTemplateCreateEditComponent]
})
export class DotTemplateCreateEditModule {}
