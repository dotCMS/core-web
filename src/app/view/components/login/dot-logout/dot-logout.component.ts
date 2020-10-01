import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DotLoginInformation } from '@models/dot-login';
import { Observable } from 'rxjs';
import { DotLoginPageStateService } from '@components/login/shared/services/dot-login-page-state.service';
import {DotRouterService} from '@services/dot-router/dot-router.service';

@Component({
    selector: 'dot-dot-logout',
    templateUrl: './dot-logout.component.html',
    styleUrls: ['./dot-logout.component.scss']
})
export class DotLogoutComponent implements OnInit {
    loginInfo$: Observable<DotLoginInformation>;

    constructor(public loginPageStateService: DotLoginPageStateService, private dotRouterService: DotRouterService) {
    }

    ngOnInit() {
        this.loginInfo$ = this.loginPageStateService.get().pipe(take(1));
    }

    goToDotAdmin(): void {
        this.dotRouterService.goToLogin();
    }
}

