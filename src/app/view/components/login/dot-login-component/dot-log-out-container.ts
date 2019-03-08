import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from 'dotcms-js';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-log-out-container',
    template: ''
})
export class DotLogOutContainerComponent {
    constructor(loginService: LoginService, router: DotRouterService) {
        loginService.isLogin$.subscribe((isLogin) => {
            if (isLogin) {
                loginService.logOutUser().subscribe(() => {});
            } else {
                router.goToLogin();
            }
        });
    }
}
