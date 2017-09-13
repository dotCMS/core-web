import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTextareaContentComponent } from './dot-textarea-content.component';
import { SelectButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SelectButtonModule,
        FormsModule
    ],
    declarations: [DotTextareaContentComponent],
    exports: [DotTextareaContentComponent]
})
export class DotTextareaContentModule {}
