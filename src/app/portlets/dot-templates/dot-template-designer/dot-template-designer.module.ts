import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DotTemplateDesignerRoutingModule } from './dot-template-designer-routing.module';
import { DotLayoutDesignerModule } from '@portlets/dot-edit-page/layout/dot-edit-layout-designer/components/dot-layout-designer/dot-layout-designer.module';
import { DotTemplateDesignerComponent } from './dot-template-designer.component';
import { DotPortletBaseModule } from '@components/dot-portlet-base/dot-portlet-base.module';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
    declarations: [DotTemplateDesignerComponent],
    imports: [
        ButtonModule,
        CommonModule,
        DotLayoutDesignerModule,
        DotPortletBaseModule,
        DotTemplateDesignerRoutingModule,
        DynamicDialogModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DotTemplateDesignerModule {}
