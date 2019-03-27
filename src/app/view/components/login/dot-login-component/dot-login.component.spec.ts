import { DotLoginComponent } from '@components/login/dot-login-component/dot-login.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';
import {LoginContainerComponent} from '@components/login/dot-login-container-component/login-container.component';
import {DotLoadingIndicatorService} from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.service';

fdescribe('DotLoginComponent', () => {
    let component: DotLoginComponent;
    let fixture: ComponentFixture<DotLoginComponent>;
    let de: DebugElement;
    let loginService: LoginService;
    let dotRouterService: DotRouterService;
    let loginPageStateService: LoginPageStateService;

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
                LoginPageStateService
            ]
        });

        fixture = DOTTestBed.createComponent(DotLoginComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        loginService = de.injector.get(LoginService);
        dotRouterService = de.injector.get(DotRouterService);
        loginPageStateService = de.injector.get(LoginPageStateService);
        spyOn(loginService, 'getLoginFormInfo').and.returnValue(of(mockLoginFormResponse));
        spyOnProperty(loginPageStateService, 'dotLoginInformation', 'get').and.returnValue(
            of(mockLoginFormResponse)
        );
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



/*

fdescribe('LoginContainerComponent', () => {
    let component: LoginContainerComponent;
    let loginService: LoginService;
    let dotRouterService: DotRouterService;
    let fixture: ComponentFixture<LoginContainerComponent>;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                imports: [MdInputTextModule, RouterTestingModule, BrowserAnimationsModule],
                declarations: [LoginContainerComponent, TestDotLoginComponent],
                providers: [
                    DotLoadingIndicatorService,
                    { provide: LoginService, useClass: LoginServiceMock }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginContainerComponent);
        component = fixture.componentInstance;
        loginService = fixture.componentRef.injector.get(LoginService);
        dotRouterService = fixture.componentRef.injector.get(DotRouterService);
        fixture.detectChanges();
    });

    it('should have dot-login-component', () => {
        expect(fixture.debugElement.query(By.css('dot-login-component'))).not.toBeNull();
    });

    describe('loginUser()', () => {
        beforeEach(() => {
            spyOn(loginService, 'loginUser').and.callThrough();
            spyOn(component, 'logInUser').and.callThrough();
            spyOn(dotRouterService, 'goToMain');
            const loginComponent: TestDotLoginComponent = fixture.debugElement.query(
                By.css('dot-login-component')
            ).componentInstance;

            loginComponent.login.emit({
                login: 'admin@dotcms.com',
                password: 'admin',
                rememberMe: false,
                language: 'en'
            });
        });

        it('should call login user method on login component emit', () => {
            expect(component.logInUser).toHaveBeenCalledWith({
                login: 'admin@dotcms.com',
                password: 'admin',
                rememberMe: false,
                language: 'en'
            });
        });

        it('should call login service correctly', () => {
            expect(loginService.loginUser).toHaveBeenCalledWith(
                'admin@dotcms.com',
                'admin',
                false,
                'en'
            );
        });

        it('should redirect correctly after login', () => {
            expect(dotRouterService.goToMain).toHaveBeenCalledWith('redirect/to');
        });
    });
});*/
