import { NgModule } from '@angular/core';
import { DotTemplateComponent } from './dot-template.component';
import { InputTextModule } from 'primeng/inputtext';
import { DotTextareaContentModule } from '@components/_common/dot-textarea-content/dot-textarea-content.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [DotTemplateComponent],
    imports: [InputTextModule, ButtonModule, DotTextareaContentModule]
})
export class DotTemplateModule {}
