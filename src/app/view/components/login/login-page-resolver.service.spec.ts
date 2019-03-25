import { LoginPageResolver } from '@components/login/login-page-resolver.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock, mockLoginFormResponse } from '@tests/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { async } from '@angular/core/testing';
import { of } from 'rxjs';

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

    it('should set the background Image and background color', () => {
        spyOn(loginService, 'getLoginFormInfo').and.returnValue(
            of({ bodyJsonObject: mockLoginFormResponse })
        );
        loginPageResolver.resolve().subscribe(() => {
            expect(document.body.style.backgroundColor).toEqual('rgb(58, 56, 71)');
            expect(document.body.style.backgroundImage).toEqual(
                'url("/html/images/backgrounds/bg-11.jpg")'
            );
        });
    });

    it('should set the background Image and background color empty when no info', () => {
        loginPageResolver.resolve().subscribe(() => {
            expect(document.body.style.backgroundColor).toEqual('');
            expect(document.body.style.backgroundImage).toEqual('');
        });
    });
});
