import { ForgotPasswordComponent } from '@components/login/forgot-password-component/forgot-password.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock, mockLoginFormResponse } from '@tests/login-service.mock';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/primeng';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { of } from 'rxjs';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';

fdescribe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let de: DebugElement;
    let loginPageStateService: LoginPageStateService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [ForgotPasswordComponent],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                ButtonModule,
                InputTextModule,
                DotFieldValidationMessageModule
            ],
            providers: [
                { provide: LoginService, useClass: LoginServiceMock },
                LoginPageStateService
            ]
        });

        fixture = DOTTestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        loginPageStateService = de.injector.get(LoginPageStateService);
        spyOnProperty(loginPageStateService, 'dotLoginInformation', 'get').and.returnValue(
            of(mockLoginFormResponse)
        );

        fixture.detectChanges();
        this.requestPasswordButton = de.query(By.css('button[type="submit"]'));
    });

    it('should load form labels correctly', () => {
        const header: DebugElement = de.query(By.css('h3'));
        const cancelButton: DebugElement = de.query(By.css('button'));
        const submitButton: DebugElement = de.query(By.css('button[type="submit"]'));

        expect(header.nativeElement.innerHTML).toEqual('Forgot Password');
        expect(cancelButton.nativeElement.innerHTML).toContain('Cancel');
        expect(submitButton.nativeElement.innerHTML).toContain('Recover Password');
    });

    it('should keep recover password button disabled until the form is valid', () => {
        expect(this.requestPasswordButton.nativeElement.disabled).toBe(true);
    });

    it('should emit the request password correctly', () => {
        component.forgotPasswordForm.setValue({ login: 'test' });
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(component.recoverPassword, 'emit');
        fixture.detectChanges();

        expect(this.requestPasswordButton.nativeElement.disabled).toBeFalsy();

        this.requestPasswordButton.triggerEventHandler('click', {});

        expect(component.recoverPassword.emit).toHaveBeenCalledWith('test');
    });

    it('should show error message for required form fields', () => {
        component.forgotPasswordForm.get('login').markAsDirty();
        fixture.detectChanges();

        const errorrMessages = de.queryAll(By.css('.ui-messages-error'));
        expect(errorrMessages.length).toBe(1);
    });

    it('should show messages', () => {
        component.message = 'Unknown Error';
        fixture.detectChanges();
        const messageElemnt = de.query(By.css('.error-message'));
        expect(messageElemnt).not.toBeNull();
    });

    it('should emit cancel when cancel button is clicked', () => {
        spyOn(component.cancel, 'emit');
        const cancelButton = de.query(By.css('button[secondary]'));
        cancelButton.triggerEventHandler('click', {});

        expect(component.cancel.emit).toHaveBeenCalled();
    });
});
