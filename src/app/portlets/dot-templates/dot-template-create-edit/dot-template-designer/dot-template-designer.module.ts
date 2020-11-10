import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DotLayoutDesignerModule } from '@portlets/dot-edit-page/layout/dot-edit-layout-designer/components/dot-layout-designer/dot-layout-designer.module';
import { DotTemplateDesignerComponent } from './dot-template-designer.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DotTemplatePropsModule } from '../dot-template-props/dot-template-props.module';

@NgModule({
    declarations: [DotTemplateDesignerComponent],
    exports: [DotTemplateDesignerComponent],
    imports: [
        ButtonModule,
        CommonModule,
        DotLayoutDesignerModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicDialogModule,
        DotTemplatePropsModule
    ],
    providers: [DialogService]
})
export class DotTemplateDesignerModule {}
