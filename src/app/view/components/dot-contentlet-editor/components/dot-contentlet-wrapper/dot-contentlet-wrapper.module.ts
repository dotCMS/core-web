import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotIframeDialogModule } from '../../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';
import { DotContentletWrapperComponent } from '../dot-contentlet-wrapper/dot-contentlet-wrapper.component';

@NgModule({
    imports: [CommonModule, DotIframeDialogModule],
    declarations: [
        DotContentletWrapperComponent
    ],
    exports: [DotContentletWrapperComponent],
    providers: [DotContentletEditorService]
})
export class DotContentletWrapperModule {}
