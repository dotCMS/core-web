import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateCreateEditComponent } from './dot-template-create-edit.component';
import { DotTemplateCreateEditRoutingModule } from './dot-template-create-edit-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { DotPortletBaseModule } from '@components/dot-portlet-base/dot-portlet-base.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DotApiLinkModule } from '@components/dot-api-link/dot-api-link.module';
import { ButtonModule } from 'primeng/button';
import { DotEditLayoutDesignerModule } from '@components/dot-edit-layout-designer/dot-edit-layout-designer.module';
import { DotTemplatePropsModule } from './dot-template-props/dot-template-props.module';
import { DotTemplateAdvancedModule } from './dot-template-advanced/dot-template-advanced.module';
import { DotPortletBoxModule } from '@components/dot-portlet-base/components/dot-portlet-box/dot-portlet-box.module';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DotApiLinkModule,
        DotEditLayoutDesignerModule,
        DotPortletBaseModule,
        DotTemplateAdvancedModule,
        DotTemplateCreateEditRoutingModule,
        DotTemplatePropsModule,
        DynamicDialogModule,
        TabViewModule,
        DotPortletBoxModule
    ],
    declarations: [DotTemplateCreateEditComponent],
    providers: [DialogService]
})
export class DotTemplateCreateEditModule {}
