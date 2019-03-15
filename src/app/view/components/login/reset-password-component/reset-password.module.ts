import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule, InputTextModule } from 'primeng/primeng';

import { ResetPasswordContainerComponent } from './reset-password-container.component';
import { ResetPasswordComponent } from './reset-password.component';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';

const routes: Routes = [
    {
        component: ResetPasswordContainerComponent,
        path: ''
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        DotFieldValidationMessageModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ResetPasswordContainerComponent, ResetPasswordComponent]
})
export class ResetPasswordModule {}
