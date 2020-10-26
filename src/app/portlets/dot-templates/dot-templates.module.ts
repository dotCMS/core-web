import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotTemplatesRoutingModule } from './dot-templates-routing.module';
import { DotTemplatesComponent } from './dot-templates.component';

@NgModule({
    declarations: [DotTemplatesComponent],
    imports: [CommonModule, DotTemplatesRoutingModule]
})
export class DotTemplatesModule {}
