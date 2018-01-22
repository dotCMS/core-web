import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageToolbarComponent } from './dot-edit-page-toolbar.component';
import { ToolbarModule, SelectButtonModule, InputSwitchModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ButtonModule, CommonModule, ToolbarModule, SelectButtonModule, InputSwitchModule, FormsModule],
    exports: [DotEditPageToolbarComponent],
    declarations: [DotEditPageToolbarComponent]
})
export class DotEditPageToolbarModule {}
