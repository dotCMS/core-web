import { NgModule } from '@angular/core';
import { DotTemplatesRoutingModule } from '@portlets/dot-templates/dot-templates-routing.module';
import { DotTemplateListModule } from '@portlets/dot-templates/dot-template-list/dot-template-list.module';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { DotContainerSelectorModule } from '@components/dot-container-selector-layout/dot-container-selector-layout.module';

@NgModule({
    imports: [DotTemplatesRoutingModule, DotTemplateListModule, DotContainerSelectorModule],
    providers: [TemplateContainersCacheService]
})
export class DotTemplatesModule {}
