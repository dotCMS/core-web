import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';
import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DotContentletWrapperModule } from '../dot-contentlet-wrapper/dot-contentlet-wrapper.module';

@NgModule({
    imports: [CommonModule, DotContentletWrapperModule],
    declarations: [
        DotEditContentletComponent,
    ],
    exports: [DotEditContentletComponent],
    providers: [DotContentletEditorService]
})
export class DotEditContentletModule {}
