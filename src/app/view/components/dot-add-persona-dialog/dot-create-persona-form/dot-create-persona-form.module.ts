import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotCreatePersonaFormComponent } from '@components/dot-add-persona-dialog/dot-create-persona-form/dot-create-persona-form.component';
import { ButtonModule, FileUploadModule, InputTextModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { DotSiteSelectorModule } from '@components/_common/dot-site-selector/dot-site-selector.module';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotAutofocusModule } from '@directives/dot-autofocus/dot-autofocus.module';

@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        InputTextModule,
        ReactiveFormsModule,
        DotSiteSelectorModule,
        DotFieldValidationMessageModule,
        DotAutofocusModule,
        ButtonModule
    ],
    declarations: [DotCreatePersonaFormComponent],
    exports: [DotCreatePersonaFormComponent]
})
export class DotCreatePersonaFormModule {}
