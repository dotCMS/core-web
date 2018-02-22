import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditContentViewAsToolbarComponent } from './dot-edit-content-view-as-toolbar.component';
import { DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, DropdownModule, FormsModule],
    declarations: [DotEditContentViewAsToolbarComponent],
    exports: [DotEditContentViewAsToolbarComponent]
})
export class DotEditContentViewAsToolbarModule {}
