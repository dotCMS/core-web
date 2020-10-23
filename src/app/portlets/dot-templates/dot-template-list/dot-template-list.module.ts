import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateListComponent } from './dot-template-list.component';
import { DotTemplateListResolver } from '@portlets/dot-templates/dot-template-list/dot-template-list-resolver.service';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';

@NgModule({
    declarations: [DotTemplateListComponent],
    imports: [CommonModule, DotListingDataTableModule],
    providers: [DotTemplateListResolver, DotTemplatesService]
})
export class DotTemplateListModule {}
