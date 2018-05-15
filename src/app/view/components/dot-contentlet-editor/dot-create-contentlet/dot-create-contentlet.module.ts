import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotCreateContentletComponent } from './dot-create-contentlet.component';
import { DotIframeDialogModule } from '../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotContentletEditorService } from '../services/dot-add-contentlet.service';

@NgModule({
    imports: [CommonModule, DotIframeDialogModule],
    declarations: [DotCreateContentletComponent],
    exports: [DotCreateContentletComponent],
    providers: [DotContentletEditorService]
})
export class DotCreateContentletModule {}
