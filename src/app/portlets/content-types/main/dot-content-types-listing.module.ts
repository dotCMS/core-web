import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypesPortletComponent } from '.';
import { ContentTypesInfoService } from '@services/content-types-info';
import { CrudService } from '@services/crud';
import { DotContentTypeService } from '@services/dot-content-type';
import { ListingDataTableModule } from '@components/listing-data-table';
import { DotBaseTypeSelectorModule } from '@components/dot-base-type-selector';
import { PushPublishContentTypesDialogModule } from '@components/_common/push-publish-dialog';
import { DotAddToBundleModule } from '@components/_common/dot-add-to-bundle';
import { DotContentTypesListingRoutingModule } from './dot-content-types-listing-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ListingDataTableModule,
        PushPublishContentTypesDialogModule,
        DotBaseTypeSelectorModule,
        DotAddToBundleModule,
        DotContentTypesListingRoutingModule
    ],
    declarations: [ContentTypesPortletComponent],
    providers: [ContentTypesInfoService, CrudService, DotContentTypeService]
})
export class DotContentTypesListingModule {}
