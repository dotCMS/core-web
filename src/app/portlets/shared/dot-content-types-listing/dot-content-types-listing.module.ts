import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotContentTypesPortletComponent } from '.';
import { ContentTypesInfoService } from '@services/content-types-info';
import { CrudService } from '@services/crud';
import { DotContentTypeService } from '@services/dot-content-type';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';
import { DotBaseTypeSelectorModule } from '@components/dot-base-type-selector';
import { DotPushPublishContentTypesDialogModule } from '@components/_common/dot-push-publish-dialog/dot-push-publish-dialog.module';
import { DotAddToBundleModule } from '@components/_common/dot-add-to-bundle';
import { DotContentTypesListingRoutingModule } from './dot-content-types-listing-routing.module';


@NgModule({
    imports: [
        CommonModule,
        DotListingDataTableModule,
        DotPushPublishContentTypesDialogModule,
        DotBaseTypeSelectorModule,
        DotAddToBundleModule,
        DotContentTypesListingRoutingModule
    ],
    declarations: [DotContentTypesPortletComponent],
    providers: [ContentTypesInfoService, CrudService, DotContentTypeService]
})
export class DotContentTypesListingModule {}
