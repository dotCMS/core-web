import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditToolbarComponent } from './dot-edit-toolbar.component';
import { ToolbarModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, ToolbarModule],
    declarations: [DotEditToolbarComponent],
    exports: [DotEditToolbarComponent],
    providers: []
})
export class DotEditToolbarModule {}
