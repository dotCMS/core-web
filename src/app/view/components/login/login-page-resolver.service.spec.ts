import { LOGIN_LABELS, LoginPageResolver } from '@components/login/login-page-resolver.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock } from '@tests/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { async } from '@angular/core/testing';

describe('LoginPageResolver', () => {
    let loginService: LoginService;
    let loginPageResolver: LoginPageResolver;

    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [
                    LoginPageResolver,
                    { provide: LoginService, useClass: LoginServiceMock }
                ],
                imports: [RouterTestingModule]
            });
            loginPageResolver = testbed.get(LoginPageResolver);
            loginService = testbed.get(LoginService);
        })
    );

    it('should call the login service with the correct values ', () => {
        spyOn(loginService, 'getLoginFormInfo').and.callThrough();
        loginPageResolver.resolve();

        expect(loginService.getLoginFormInfo).toHaveBeenCalledWith('', LOGIN_LABELS);
    });
});
