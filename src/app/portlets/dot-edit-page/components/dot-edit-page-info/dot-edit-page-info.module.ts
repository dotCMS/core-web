import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DotEditPageInfoComponent } from './dot-edit-page-info.component';
import { ButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [DotEditPageInfoComponent],
    declarations: [DotEditPageInfoComponent]
})
export class DotEditPageInfoModule {}
