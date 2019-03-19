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
import {Checkbox, CheckboxModule, Dropdown, DropdownModule, InputTextModule} from 'primeng/primeng';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';
import { DotLoadingIndicatorModule } from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.module';
import { of } from 'rxjs';

describe('DotLoginComponent', () => {
    let component: DotLoginComponent;
    let fixture: ComponentFixture<DotLoginComponent>;
    let de: DebugElement;

    beforeEach(() => {
        this.i18nMessages = [
            'email-address',
            'user-id',
            'password',
            'remember-me',
            'sign-in',
            'get-new-password',
            'cancel',
            'Server',
            'error.form.mandatory',
            'angular.login.component.community.licence.message',
            'reset-password-success',
            'a-new-password-has-been-sent-to-x',
            'welcome-back'
        ];

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
                DotFieldValidationMessageModule
            ],
            providers: [{ provide: LoginService, useClass: LoginServiceMock }]
        });

        fixture = DOTTestBed.createComponent(DotLoginComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        this.loginService = de.injector.get(LoginService);
        spyOn(this.loginService, 'getLoginFormInfo').and.returnValue(of(mockLoginFormResponse));
        fixture.detectChanges();
        this.signInButton = de.query(By.css('button[pButton]'));
    });

    it('should focus the email/username input on load', function() {
        expect(component.emailInput.nativeElement).toBe(document.activeElement);
    });

    it('should call service on language change', () => {
        const pDropDown: DebugElement = de.query(By.css('p-dropdown'));
        spyOn(component, 'changeLanguage').and.callThrough();
        // spyOn(this.loginService, 'getLoginFormInfo');

        pDropDown.triggerEventHandler('onChange', { value: 'es_ES' });

        expect(component.changeLanguage).toHaveBeenCalledWith('es_ES');
        expect(this.loginService.getLoginFormInfo).toHaveBeenCalledWith('es_ES', this.i18nMessages);
    });

    it('should emit event to go recover password screen', () => {
        spyOn(component.recoverPassword, 'emit');
        const forgotPasswordLink: DebugElement = de.query(By.css('a[actionLink]'));

        forgotPasswordLink.triggerEventHandler('click', { value: '' });

        expect(component.recoverPassword.emit).toHaveBeenCalledTimes(1);
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
        expect(this.signInButton.nativeElement.disabled).toBeTruthy();;
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
        const messageElemnt = de.query(By.css('.error-message'));
        expect(messageElemnt).not.toBeNull();
    });

    it('should disable fields while waiting login response', () => {
        component.isLoginInProgress = true;
        const languageDropdown: Dropdown = de.query(By.css('p-dropdown')).componentInstance;
        const emailInput = de.query(By.css('input[pInputText][type="text"]'));
        const passwordInput = de.query(By.css('input[type="password"]'));
        const rememberCheckBox: Checkbox = de.query(By.css(' p-checkbox')).componentInstance;

        fixture.detectChanges();

        expect(languageDropdown.disabled).toBeTruthy();;
        expect(emailInput.nativeElement.disabled).toBeTruthy();;
        expect(passwordInput.nativeElement.disabled).toBeTruthy();;
        expect(rememberCheckBox.disabled).toBeTruthy();
    });
});
