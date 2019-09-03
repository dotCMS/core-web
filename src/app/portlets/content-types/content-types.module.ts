import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContentTypesRoutingModule } from './content-types-routing.module';
import { DotListingDataTableModule } from '@components/dot-listing-data-table/dot-listing-data-table.module';
import { DotContentTypeEditResolver } from '../shared/dot-content-types-edit/dot-content-types-edit-resolver.service';

@NgModule({
    imports: [CommonModule, ContentTypesRoutingModule, DotListingDataTableModule],
    providers: [DotContentTypeEditResolver]
})
export class ContentTypesModule {}
