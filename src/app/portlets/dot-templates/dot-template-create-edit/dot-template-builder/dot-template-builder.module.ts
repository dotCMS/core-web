import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateBuilderComponent } from './dot-template-builder.component';
import { DotEditLayoutDesignerModule } from '@components/dot-edit-layout-designer/dot-edit-layout-designer.module';
import { TabViewModule } from 'primeng/tabview';
import { DotTemplateAdvancedModule } from '../dot-template-advanced/dot-template-advanced.module';

@NgModule({
    imports: [CommonModule, DotEditLayoutDesignerModule, TabViewModule, DotTemplateAdvancedModule],
    declarations: [DotTemplateBuilderComponent],
    exports: [DotTemplateBuilderComponent]
})
export class DotTemplateBuilderModule {}
