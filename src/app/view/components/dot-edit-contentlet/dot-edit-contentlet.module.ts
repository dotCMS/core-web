import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DotIframeDialogModule } from '../dot-iframe-dialog/dot-iframe-dialog.module';

@NgModule({
    imports: [CommonModule, DotIframeDialogModule],
    declarations: [DotEditContentletComponent],
    exports: [DotEditContentletComponent]
})
export class DotEditContentletModule {}
