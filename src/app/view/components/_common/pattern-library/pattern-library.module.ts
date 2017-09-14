import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PatternLibraryComponent } from './pattern-library.component';

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
  TreeTableModule
} from 'primeng/primeng';

// CUSTOM MDOULES
import { ActionButtonModule } from '../action-button/action-button.module';
import { ListingDataTableModule} from '../../listing-data-table/listing-data-table.module';
import { FieldValidationMessageModule} from '../field-validation-message/file-validation-message.module';
import { SiteSelectorModule} from '../site-selector/site-selector.module';
import { SearchableDropDownModule } from '../searchable-dropdown/searchable-dropdown.module';



import { DotDropdownModule} from '../dropdown-component/dot-dropdown.module';

const routes: Routes = [
  {
    component: PatternLibraryComponent,
    path: ''
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DotDropdownModule,

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

    ActionButtonModule,
    ListingDataTableModule,
    FieldValidationMessageModule,
    SiteSelectorModule,
    SearchableDropDownModule
  ],
  declarations: [
    PatternLibraryComponent
  ]
})

export class PatternLibraryModule { }
