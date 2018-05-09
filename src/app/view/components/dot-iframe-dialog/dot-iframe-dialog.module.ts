import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotIframeDialogComponent } from './dot-iframe-dialog.component';
import { DialogModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, DialogModule],
    declarations: [DotIframeDialogComponent],
    exports: [DotIframeDialogComponent]
})
export class DotIframeDialogModule {}
