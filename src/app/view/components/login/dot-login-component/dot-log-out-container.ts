import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService } from 'dotcms-js';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { take } from 'rxjs/operators';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-log-out-container',
    template: ''
})
export class DotLogOutContainerComponent {
    constructor(loginService: LoginService, router: DotRouterService) {
        loginService.isLogin$.pipe(take(1)).subscribe(isLogin => {
            if (isLogin) {
                loginService
                    .logOutUser()
                    .pipe(take(1))
                    .subscribe(() => {});
            } else {
                router.goToLogin();
            }
        });
    }
}
