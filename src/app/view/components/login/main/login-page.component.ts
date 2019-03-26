import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotLoginInformation, DotSystemInformation } from '@models/dot-login';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-login-page-component',
    styleUrls: ['./login-page.component.scss'],
    templateUrl: 'login-page.component.html'
})
/**
 * The login component allows set the background image and background color.
 */
export class LoginPageComponent implements OnDestroy {
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        public loginPageStateService: LoginPageStateService
    ) {
        this.loginPageStateService.dotLoginInformation = this.route.data.pipe(
            pluck('loginFormInfo')
        );

        this.loginPageStateService.dotLoginInformation
            .pipe(takeUntil(this.destroy$))
            .subscribe((loginInfo: DotLoginInformation) => {
                document.body.style.backgroundColor = this.setBackgroundColor(loginInfo.entity);
                document.body.style.backgroundImage = this.setBackgroundImage(loginInfo.entity);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private setBackgroundColor(systemInformation: DotSystemInformation): string {
        return systemInformation.backgroundColor !== 'undefined'
            ? systemInformation.backgroundColor
            : '';
    }

    private setBackgroundImage(systemInformation: DotSystemInformation): string {
        return systemInformation.backgroundPicture !== 'undefined' &&
            systemInformation.backgroundPicture !== ''
            ? 'url(' + systemInformation.backgroundPicture + ')'
            : '';
    }
}
