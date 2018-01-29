import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DialogModule, DropdownModule, CheckboxModule } from 'primeng/primeng';
import { FieldValidationMessageModule } from '../field-validation-message/file-validation-message.module';
import { DotAddToBundleComponent } from './dot-add-to-bundle.component';
import { AddToBundleService } from '../../../../api/services/add-to-bundle/add-to-bundle.service';


@NgModule({
    declarations: [
        DotAddToBundleComponent
    ],
    exports: [
        DotAddToBundleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DialogModule,
        ReactiveFormsModule,
        DropdownModule,
        FieldValidationMessageModule,
        CheckboxModule
    ],
    providers: [AddToBundleService]
})

export class DotAddToBundleModule {}
