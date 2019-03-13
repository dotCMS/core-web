import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';
import { DotSystemInformation } from '@models/dot-login';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-login-page-component',
    styleUrls: ['./login-page.component.scss'],
    templateUrl: 'login-page-component.html'
})
/**
 * The login component allows the user to fill all
 * the info required to log in the dotCMS angular backend
 */
export class LoginPageComponent implements OnInit {
    constructor(private loginService: LoginService, private loggerService: LoggerService) {}

    ngOnInit(): void {
        this.loginService
            .getLoginFormInfo('', [])
            .pipe(pluck('entity'))
            .subscribe(
                (systemInformation: DotSystemInformation) => {
                    document.body.style.backgroundColor = this.setBackgroundColor(
                        systemInformation
                    );

                    document.body.style.backgroundImage = this.setBackgroundImage(
                        systemInformation
                    );
                },
                error => {
                    this.loggerService.debug(error);
                }
            );
    }

    private setBackgroundColor(systemInformation: DotSystemInformation): string {
        return systemInformation.backgroundColor !== 'undefined' &&
            systemInformation.backgroundColor !== ''
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
