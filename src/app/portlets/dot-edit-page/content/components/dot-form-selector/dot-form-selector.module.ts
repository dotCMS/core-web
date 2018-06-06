import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotFormSelectorComponent } from './dot-form-selector.component';
import { DataTableModule } from 'primeng/primeng';
import { MessageKeyDirective } from '../../../../../view/directives/message-keys/message-keys.directive';

@NgModule({
    imports: [CommonModule, DataTableModule],
    declarations: [DotFormSelectorComponent, MessageKeyDirective],
    exports: [DotFormSelectorComponent]
})
export class DotFormSelectorModule {}
