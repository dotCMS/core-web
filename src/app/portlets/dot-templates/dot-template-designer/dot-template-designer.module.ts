import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DotTemplateDesignerRoutingModule } from './dot-template-designer-routing.module';
import { DotLayoutDesignerModule } from '@portlets/dot-edit-page/layout/dot-edit-layout-designer/components/dot-layout-designer/dot-layout-designer.module';
import { DotTemplateDesignerComponent } from './dot-template-designer.component';

@NgModule({
    declarations: [DotTemplateDesignerComponent],
    imports: [
        CommonModule,
        DotTemplateDesignerRoutingModule,
        DotLayoutDesignerModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DotTemplateDesignerModule {}
