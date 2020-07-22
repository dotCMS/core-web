import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectButtonModule } from 'primeng/primeng';
import { DotEditPageMenuComponent } from './dot-edit-page-menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DotEditPageMenuComponent],
    exports: [DotEditPageMenuComponent],
    imports: [CommonModule, FormsModule, SelectButtonModule]
})
export class DotEditPageMenuModule {}
