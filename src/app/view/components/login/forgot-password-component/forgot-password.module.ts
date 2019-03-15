import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule, InputTextModule } from 'primeng/primeng';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordContainerComponent } from './forgot-password-container.component';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';

const routes: Routes = [
    {
        component: ForgotPasswordContainerComponent,
        path: ''
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        MdInputTextModule,
        ReactiveFormsModule,
        DotFieldValidationMessageModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ForgotPasswordComponent, ForgotPasswordContainerComponent]
})
export class ForgotPasswordModule {}
