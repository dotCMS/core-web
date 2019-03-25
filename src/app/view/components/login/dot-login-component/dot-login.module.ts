import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DotLoadingIndicatorModule } from '../../_common/iframe/dot-loading-indicator/dot-loading-indicator.module';
import { ButtonModule, CheckboxModule, DropdownModule, InputTextModule } from 'primeng/primeng';

import { LoginContainerComponent } from './login-container.component';
import { DotLoginComponent } from '@components/login/dot-login-component/dot-login.component';

import { SharedModule } from '@shared/shared.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotAutofocusModule } from '@directives/dot-autofocus/dot-autofocus.module';

const routes: Routes = [
    {
        component: LoginContainerComponent,
        path: ''
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        InputTextModule,
        SharedModule,
        DotLoadingIndicatorModule,
        MdInputTextModule,
        DotDirectivesModule,
        ReactiveFormsModule,
        DotFieldValidationMessageModule,
        DotAutofocusModule
    ],
    declarations: [LoginContainerComponent, DotLoginComponent]
})
export class DotLoginModule {}
