import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DotLayoutDesignerModule } from '@portlets/dot-edit-page/layout/dot-edit-layout-designer/components/dot-layout-designer/dot-layout-designer.module';
import { DotTemplateDesignerComponent } from './dot-template-designer.component';
import { DotPortletBaseModule } from '@components/dot-portlet-base/dot-portlet-base.module';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DotTemplatePropsModule } from './dot-template-props/dot-template-props.module';
import { DotApiLinkModule } from '@components/dot-api-link/dot-api-link.module';

@NgModule({
    declarations: [DotTemplateDesignerComponent],
    exports: [DotTemplateDesignerComponent],
    imports: [
        ButtonModule,
        CommonModule,
        DotLayoutDesignerModule,
        DotPortletBaseModule,
        DynamicDialogModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicDialogModule,
        DotTemplatePropsModule,
        DotApiLinkModule
    ],
    providers: [DialogService]
})
export class DotTemplateDesignerModule {}
