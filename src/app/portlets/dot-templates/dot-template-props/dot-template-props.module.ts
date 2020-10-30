import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplatePropsComponent } from './dot-template-props.component';
import { DotFormDialogModule } from '@components/dot-form-dialog/dot-form-dialog.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    declarations: [DotTemplatePropsComponent],
    imports: [CommonModule, DotFormDialogModule, InputTextModule, InputTextareaModule]
})
export class DotTemplatePropsModule {}
