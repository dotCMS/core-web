import { DotLargeMessageDisplayModule } from './view/components/dot-large-message-display/dot-large-message-display.module';
// CUSTOM MDOULES
import { DotActionButtonModule } from './view/components/_common/dot-action-button/dot-action-button.module';
import { DotFieldValidationMessageModule } from './view/components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { ListingDataTableModule } from './view/components/listing-data-table/listing-data-table.module';
import { SiteSelectorModule } from './view/components/_common/site-selector/site-selector.module';
import { SearchableDropDownModule } from './view/components/_common/searchable-dropdown';
import { IFrameModule } from './view/components/_common/iframe';
import { DotToolbarModule } from '@components/dot-toolbar/dot-toolbar.module';


import {
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SplitButtonModule,
    TabViewModule,
    ToolbarModule,
    TreeTableModule,
    MultiSelectModule,
    SelectButtonModule
} from 'primeng/primeng';
import { DotIconModule } from './view/components/_common/dot-icon/dot-icon.module';
import { DotIconButtonModule } from './view/components/_common/dot-icon-button/dot-icon-button.module';
import { DotTextareaContentModule } from './view/components/_common/dot-textarea-content/dot-textarea-content.module';
import { DotGlobalMessageModule } from './view/components/_common/dot-global-message/dot-global-message.module';
import { DotContentletEditorModule } from './view/components/dot-contentlet-editor/dot-contentlet-editor.module';
import { DotWorkflowTaskDetailModule } from './view/components/dot-workflow-task-detail/dot-workflow-task-detail.module';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotMessageDisplayModule } from '@components/dot-message-display/dot-message-display.module';

export const CUSTOM_MODULES = [
    DotToolbarModule,
    DotActionButtonModule,
    DotContentletEditorModule,
    DotDialogModule,
    DotGlobalMessageModule,
    DotIconButtonModule,
    DotIconModule,
    DotTextareaContentModule,
    DotWorkflowTaskDetailModule,
    DotMessageDisplayModule,
    DotFieldValidationMessageModule,
    IFrameModule,
    ListingDataTableModule,
    SearchableDropDownModule,
    SiteSelectorModule,
    DotLargeMessageDisplayModule
];

export const NGFACES_MODULES = [
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    PasswordModule,
    RadioButtonModule,
    SelectButtonModule,
    SharedModule,
    SplitButtonModule,
    TabViewModule,
    ToolbarModule,
    TreeTableModule
];
