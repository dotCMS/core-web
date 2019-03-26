import { DotLoginComponent } from '@components/login/dot-login-component/dot-login.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock, mockLoginFormResponse } from '@tests/login-service.mock';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
    Checkbox,
    CheckboxModule,
    Dropdown,
    DropdownModule,
    InputTextModule
} from 'primeng/primeng';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';
import { DotLoadingIndicatorModule } from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.module';
import { of } from 'rxjs';
import { LOGIN_LABELS } from '@components/login/login-page-resolver.service';
import { ActivatedRoute } from '@angular/router';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DotLoginComponent', () => {
    let component: DotLoginComponent;
    let fixture: ComponentFixture<DotLoginComponent>;
    let de: DebugElement;
    let loginService: LoginService;
    let dotRouterService: DotRouterService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotLoginComponent],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                ButtonModule,
                CheckboxModule,
                DropdownModule,
                MdInputTextModule,
                InputTextModule,
                DotLoadingIndicatorModule,
                DotFieldValidationMessageModule,
                RouterTestingModule
            ],
            providers: [
                { provide: LoginService, useClass: LoginServiceMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: of({
                            loginFormInfo: mockLoginFormResponse
                        })
                    }
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotLoginComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        loginService = de.injector.get(LoginService);
        dotRouterService = de.injector.get(DotRouterService);
        spyOn(loginService, 'getLoginFormInfo').and.returnValue(of(mockLoginFormResponse));
        fixture.detectChanges();
        this.signInButton = de.query(By.css('button[pButton]'));
    });

    it('should load form labels correctly', () => {
        const header: DebugElement = de.query(By.css('h3'));
        const inputLabels: DebugElement[] = de.queryAll(By.css('span[dotmdinputtext] label'));
        const recoverPasswordLink: DebugElement = de.query(By.css('a[actionlink]'));
        const rememberMe: DebugElement = de.query(By.css('p-checkbox label'));
        const submitButton: DebugElement = de.query(By.css('.login__button'));
        const productInformation: DebugElement[] = de.queryAll(By.css('.login__footer span'));

        expect(header.nativeElement.innerHTML).toEqual('Welcome Back!');
        expect(inputLabels[0].nativeElement.innerHTML).toEqual('Email Address');
        expect(inputLabels[1].nativeElement.innerHTML).toEqual('Password');
        expect(recoverPasswordLink.nativeElement.innerHTML).toEqual('Recover Password');
        expect(rememberMe.nativeElement.innerHTML).toEqual('Remember Me');
        expect(submitButton.nativeElement.innerHTML).toContain('Sign In');
        expect(productInformation[0].nativeElement.innerHTML).toEqual('Server: 860173b0');
        expect(productInformation[1].nativeElement.innerHTML).toEqual('COMMUNITY EDITION: 5.0.0');
        expect(productInformation[2].nativeElement.innerHTML).toEqual(
            ' - <a href="https://dotcms.com/features" target="_blank">upgrade</a>'
        );
    });

    it('should call service on language change', () => {
        const pDropDown: DebugElement = de.query(By.css('p-dropdown'));
        pDropDown.triggerEventHandler('onChange', { value: 'es_ES' });

        expect(loginService.getLoginFormInfo).toHaveBeenCalledWith('es_ES', LOGIN_LABELS);
    });

    it('should navigate to the recover password screen', () => {
        spyOn(dotRouterService, 'goToForgotPassword');
        const forgotPasswordLink: DebugElement = de.query(By.css('a[actionLink]'));

        forgotPasswordLink.triggerEventHandler('click', { value: '' });

        expect(dotRouterService.goToForgotPassword).toHaveBeenCalledTimes(1);
    });

    it('should load initial value of the form', () => {
        expect(component.loginForm.value).toEqual({
            login: '',
            language: 'en_US',
            password: '',
            rememberMe: false
        });
    });

    it('should emit login request correctly', () => {
        const credentials = {
            login: 'admin@dotcms.com',
            language: 'en_US',
            password: 'admin',
            rememberMe: false
        };

        component.loginForm.setValue(credentials);
        spyOn(component, 'logInUser').and.callThrough();
        spyOn(component.login, 'emit');
        fixture.detectChanges();

        expect(this.signInButton.nativeElement.disabled).toBeFalsy();

        this.signInButton.triggerEventHandler('click', {});

        expect(component.logInUser).toHaveBeenCalled();
        expect(component.login.emit).toHaveBeenCalledWith(credentials);
    });

    it('should keep submit button disabled until the form is valid', () => {
        expect(this.signInButton.nativeElement.disabled).toBeTruthy();
    });

    it('should show error message for required form fields', () => {
        component.loginForm.get('login').markAsDirty();
        component.loginForm.get('password').markAsDirty();

        fixture.detectChanges();

        const erroresMessages = de.queryAll(By.css('.ui-messages-error'));
        expect(erroresMessages.length).toBe(2);
    });

    it('should show messages', () => {
        component.message = 'Authentication failed. Please try again.';
        fixture.detectChanges();
        const messageElemement = de.query(By.css('.error-message'));
        expect(messageElemement).not.toBeNull();
    });

    it('should disable fields while waiting login response', () => {
        component.isLoginInProgress = true;
        const languageDropdown: Dropdown = de.query(By.css('p-dropdown')).componentInstance;
        const emailInput = de.query(By.css('input[pInputText][type="text"]'));
        const passwordInput = de.query(By.css('input[type="password"]'));
        const rememberCheckBox: Checkbox = de.query(By.css(' p-checkbox')).componentInstance;

        fixture.detectChanges();

        expect(languageDropdown.disabled).toBeTruthy();
        expect(emailInput.nativeElement.disabled).toBeTruthy();
        expect(passwordInput.nativeElement.disabled).toBeTruthy();
        expect(rememberCheckBox.disabled).toBeTruthy();
    });
});
