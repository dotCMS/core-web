import { Component, OnInit } from '@angular/core';
import { DotLoginUserSystemInformation } from '@models/dot-login';
import { pluck, take } from 'rxjs/operators';
import { DotLoginPageStateService } from '@components/login/shared/services/dot-login-page-state.service';

@Component({
    selector: 'dot-login-page-component',
    styleUrls: ['./login-page.component.scss'],
    templateUrl: 'login-page.component.html'
})
/**
 * The login component allows set the background image and background color.
 */
export class LoginPageComponent implements OnInit {
    constructor(
        public loginPageStateService: DotLoginPageStateService
    ) {}

    ngOnInit(): void {
        this.loginPageStateService
            .get()
            .pipe(take(1), pluck('entity'))
            .subscribe((dotLoginUserSystemInformation: DotLoginUserSystemInformation) => {
                document.body.style.backgroundColor = dotLoginUserSystemInformation.backgroundColor || '';
                document.body.style.backgroundImage = dotLoginUserSystemInformation.backgroundPicture
                    ? `url('${dotLoginUserSystemInformation.backgroundPicture}')`
                    : '';
            });
    }
}
