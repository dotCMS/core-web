import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotTemplatesRoutingModule } from './dot-templates-routing.module';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotTemplateListModule } from '@portlets/dot-templates/dot-template-list/dot-template-list.module';
import { DotContainerSelectorLayoutModule } from '@components/dot-container-selector-layout/dot-container-selector-layout.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DotTemplatesRoutingModule,
        DotTemplatesRoutingModule,
        DotTemplateListModule,
        DotContainerSelectorLayoutModule
    ],
    providers: [DotTemplatesService]
})
export class DotTemplatesModule {}
