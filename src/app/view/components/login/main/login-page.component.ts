import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotLoginInformation, DotSystemInformation } from '@models/dot-login';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-login-page-component',
    styleUrls: ['./login-page.component.scss'],
    templateUrl: 'login-page.component.html'
})
/**
 * The login component allows the user to fill all
 * the info required to log in the dotCMS angular backend
 */
export class LoginPageComponent implements OnDestroy {
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private route: ActivatedRoute) {
        this.route.data
            .pipe(pluck('loginFormInfo'), takeUntil(this.destroy$))
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
