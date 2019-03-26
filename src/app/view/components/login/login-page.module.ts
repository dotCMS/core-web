import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageRoutingModule } from '@components/login/login-page-routing.module';

import { LoginPageResolver } from '@components/login/login-page-resolver.service';


@NgModule({
    declarations: [],
    imports: [CommonModule, LoginPageRoutingModule],
    providers: [LoginPageResolver]
})
export class LoginPageModule {}
