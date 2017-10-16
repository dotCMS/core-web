import { CommonModule } from '@angular/common';
import { ContentTypesCreateComponent } from './create';
import { ContentTypesEditComponent } from './edit';
import { ContentTypesFormComponent } from './form';
import { ContentTypesInfoService } from '../../api/services/content-types-info';
import { ContentTypesLayoutComponent } from './layout';
import { ContentTypesPortletComponent } from './main';
import { ContentTypesRoutingModule } from './content-types-routing.module';
import { FieldValidationMessageModule } from '../../view/components/_common/field-validation-message/file-validation-message.module';
import { FormatDateService } from '../../api/services/format-date-service';
import { IconButtonTooltipModule } from '../../view/components/_common/icon-button-tooltip/icon-button-tooltip.module';
import { ListingDataTableModule } from '../../view/components/listing-data-table/listing-data-table.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SiteSelectorModule } from '../../view/components/_common/site-selector/site-selector.module';
import { DragulaModule } from 'ng2-dragula';
import { DragulaService } from 'ng2-dragula';
import { FieldService, FieldDragDropService, FieldPropertyService } from './fields/service';
import { TooltipModule } from 'primeng/primeng';

import {
    ContentTypeFieldsDropZoneComponent,
    ContentTypeFieldsPropertiesFormComponent,
    ContentTypeFieldsRowComponent,
    ContentTypeFieldsRowListComponent,
    ContentTypesFieldDragabbleItemComponent,
    ContentTypesFieldsListComponent,
    ContentTypeFieldsAddRowComponent
} from './fields';
import {
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    OverlayPanelModule,
    SplitButtonModule,
    RadioButtonModule,
    CheckboxModule,
    TabViewModule
} from 'primeng/primeng';
import {

    NamePropertyComponent,
    CheckboxPropertyComponent,
    CategoriesPropertyComponent,
    DataTypePropertyComponent,
    HintPropertyComponent,
    DefaultValuePropertyComponent,
    RegexCheckPropertyComponent,
    ValuesPropertyComponent
} from './fields/content-type-fields-properties-form/field-properties';
import {
    DynamicFieldPropertyDirective
} from './fields/content-type-fields-properties-form/field-properties/dynamic-field-property-directive/dynamic-field-property.directive';
import { IFrameModule } from '../../view/components/_common/iframe';
import { DotTextareaContentModule } from '../../view/components/_common/dot-textarea-content/dot-textarea-content.module';

@NgModule({
    declarations: [
        CategoriesPropertyComponent,
        CheckboxPropertyComponent,
        ContentTypeFieldsDropZoneComponent,
        ContentTypeFieldsDropZoneComponent,
        ContentTypeFieldsAddRowComponent,
        ContentTypeFieldsPropertiesFormComponent,
        ContentTypeFieldsRowComponent,
        ContentTypeFieldsRowComponent,
        ContentTypeFieldsRowListComponent,
        ContentTypeFieldsRowListComponent,
        ContentTypesCreateComponent,
        ContentTypesEditComponent,
        ContentTypesFieldDragabbleItemComponent,
        ContentTypesFieldsListComponent,
        ContentTypesFormComponent,
        ContentTypesLayoutComponent,
        ContentTypesPortletComponent,
        DataTypePropertyComponent,
        DefaultValuePropertyComponent,
        DynamicFieldPropertyDirective,
        HintPropertyComponent,
        NamePropertyComponent,
        RegexCheckPropertyComponent,
        ValuesPropertyComponent,
    ],
    entryComponents: [
        NamePropertyComponent,
        CheckboxPropertyComponent,
        CategoriesPropertyComponent,
        DataTypePropertyComponent,
        DefaultValuePropertyComponent,
        HintPropertyComponent,
        RegexCheckPropertyComponent,
        ValuesPropertyComponent
    ],
    exports: [
        ContentTypesPortletComponent
    ],
    imports: [
        ButtonModule,
        CheckboxModule,
        CommonModule,
        ConfirmDialogModule,
        ContentTypesRoutingModule,
        DialogModule,
        DragulaModule,
        DropdownModule,
        FieldValidationMessageModule,
        FormsModule,
        IFrameModule,
        IconButtonTooltipModule,
        InputTextModule,
        ListingDataTableModule,
        OverlayPanelModule,
        RadioButtonModule,
        ReactiveFormsModule,
        SiteSelectorModule,
        SplitButtonModule,
        TabViewModule,
        DotTextareaContentModule,
        TooltipModule
    ],
    providers: [
        ContentTypesInfoService,
        DragulaService,
        FieldDragDropService,
        FieldPropertyService,
        FieldService,
        FormatDateService
    ]
})
export class ContentTypesModule {}
