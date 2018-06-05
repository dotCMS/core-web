import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotContentTypeFormSelectorComponent } from './dot-content-type-form-selector.component';
import { DataTableModule } from 'primeng/primeng';
import { MessageKeyDirective } from '../../../../../view/directives/message-keys/message-keys.directive';

@NgModule({
    imports: [CommonModule, DataTableModule],
    declarations: [DotContentTypeFormSelectorComponent, MessageKeyDirective],
    exports: [DotContentTypeFormSelectorComponent]
})
export class DotContentTypeFormSelectorModule {}
