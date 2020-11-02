import { NgModule } from '@angular/core';
import { DotTemplatesRoutingModule } from '@portlets/dot-templates/dot-templates-routing.module';
import { DotTemplateListModule } from '@portlets/dot-templates/dot-template-list/dot-template-list.module';
import { DotContainerSelectorModule } from '@components/dot-container-selector-layout/dot-container-selector-layout.module';

@NgModule({
    imports: [DotTemplatesRoutingModule, DotTemplateListModule, DotContainerSelectorModule],
    providers: []
})
export class DotTemplatesModule {}
