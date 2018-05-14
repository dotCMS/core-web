import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotAddContentletComponent } from './dot-add-contentlet.component';
import { DotIframeDialogModule } from '../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotContentletEditorService } from '../services/dot-add-contentlet.service';

@NgModule({
    imports: [CommonModule, DotIframeDialogModule],
    declarations: [DotAddContentletComponent],
    exports: [DotAddContentletComponent],
    providers: [DotContentletEditorService]
})
export class DotAddContentletModule {}
