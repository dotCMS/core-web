import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotTemplatesRoutingModule } from './dot-templates-routing.module';
import { DotTemplatesComponent } from './dot-templates.component';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';

@NgModule({
    declarations: [DotTemplatesComponent],
    imports: [CommonModule, DotTemplatesRoutingModule],
    providers: [DotTemplatesService]
})
export class DotTemplatesModule {}
