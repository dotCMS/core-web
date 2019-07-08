import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { LoginAsComponent } from './login-as';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { PasswordModule } from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        DotDialogModule,
        PasswordModule,
        ReactiveFormsModule,
        SearchableDropDownModule
    ],
    exports: [LoginAsComponent],
    declarations: [LoginAsComponent],
    providers: []
})
export class LoginAsModule {}
