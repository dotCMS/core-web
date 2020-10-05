import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTextareaContentComponent } from './dot-textarea-content.component';
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
// import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
    imports: [
        // AceEditorModule,
        CommonModule,
        SelectButtonModule,
        FormsModule,
        MonacoEditorModule
    ],
    declarations: [DotTextareaContentComponent],
    exports: [DotTextareaContentComponent]
})
export class DotTextareaContentModule {}
