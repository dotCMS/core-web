import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DotContentTypesInfoService } from '@services/dot-content-types-info';
import { DotContentTypesPortletComponent } from './dot-content-types.component';
import { DotCrudService } from '@services/dot-crud';
import { DotContentTypeService } from '@services/dot-content-type';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';
import { DotBaseTypeSelectorModule } from '@components/dot-base-type-selector';
import { DotAddToBundleModule } from '@components/_common/dot-add-to-bundle';

import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotContentTypeCloneDialogComponent } from './components/dot-content-type-clone-dialog/dot-content-type-clone-dialog.component';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotMdIconSelectorModule } from '@components/_common/dot-md-icon-selector/dot-md-icon-selector.module';
import { SiteSelectorFieldModule } from '@components/_common/dot-site-selector-field/dot-site-selector-field.module';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';

import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,

        DotListingDataTableModule,
        DotBaseTypeSelectorModule,
        DotAddToBundleModule,
        DotPipesModule,
        DotFieldValidationMessageModule,
        DotDialogModule,
        DotMdIconSelectorModule,
        SiteSelectorFieldModule
    ],
    declarations: [DotContentTypesPortletComponent, DotContentTypeCloneDialogComponent],
    exports: [DotContentTypesPortletComponent],
    providers: [DotContentTypesInfoService, DotCrudService, DotContentTypeService]
})
export class DotContentTypesListingModule {}
