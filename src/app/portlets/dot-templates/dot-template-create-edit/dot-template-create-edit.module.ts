import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateCreateEditComponent } from './dot-template-create-edit.component';
import { DotTemplateCreateEditRoutingModule } from './dot-template-create-edit-routing.module';

@NgModule({
    imports: [CommonModule, DotTemplateCreateEditRoutingModule],
    declarations: [DotTemplateCreateEditComponent]
})
export class DotTemplateCreateEditModule {}
