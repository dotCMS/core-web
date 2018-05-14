import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DotIframeDialogModule } from '../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotAddContentletService } from '../services/dot-add-contentlet.service';

@NgModule({
    imports: [CommonModule, DotIframeDialogModule],
    declarations: [DotEditContentletComponent],
    exports: [DotEditContentletComponent],
    providers: [DotAddContentletService]
})
export class DotEditContentletModule {}
