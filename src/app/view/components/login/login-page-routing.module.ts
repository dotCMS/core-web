import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageResolver } from '@components/login/login-page-resolver.service';

const routes: Routes = [
    {
        path: 'forgotPassword',
        loadChildren:
            '@components/login/forgot-password-component/forgot-password.module#ForgotPasswordModule',
        resolve: {
            loginFormInfo: LoginPageResolver
        }
    },
    {
        path: 'login',
        loadChildren: '@components/login/dot-login-component/dot-login.module#DotLoginModule',
        resolve: {
            loginFormInfo: LoginPageResolver
        }
    },
    {
        path: 'resetPassword/:token',
        loadChildren:
            '@components/login/reset-password-component/reset-password.module#ResetPasswordModule',
        resolve: {
            loginFormInfo: LoginPageResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginPageRoutingModule {}
