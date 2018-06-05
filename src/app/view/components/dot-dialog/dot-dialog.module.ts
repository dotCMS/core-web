import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule } from 'primeng/primeng';
import { DotDialogComponent } from './dot-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [ButtonModule, CommonModule, BrowserAnimationsModule, DialogModule],
    declarations: [DotDialogComponent],
    exports: [DotDialogComponent]
})
export class DotDialogModule {}
