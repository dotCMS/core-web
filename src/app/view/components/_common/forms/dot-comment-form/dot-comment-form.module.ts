import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotCommentFormComponent } from '@components/_common/forms/dot-comment-form/dot-comment-form.component';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, DotPipesModule, InputTextareaModule],
    declarations: [DotCommentFormComponent],
    exports: [DotCommentFormComponent]
})
export class DotCommentFormModule {}
