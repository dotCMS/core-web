import { NgModule } from '@angular/core';
import { DotTemplatesRoutingModule } from '@portlets/dot-templates/dot-templates-routing.module';
import { DotTemplateListModule } from '@portlets/dot-templates/dot-template-list/dot-template-list.module';
import { DotContainerSelectorLayoutModule } from '@components/dot-container-selector-layout/dot-container-selector-layout.module';

@NgModule({
    imports: [DotTemplatesRoutingModule, DotTemplateListModule, DotContainerSelectorLayoutModule],
    providers: []
})
export class DotTemplatesModule {}
