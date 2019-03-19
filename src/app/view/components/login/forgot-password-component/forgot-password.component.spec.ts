import { ForgotPasswordComponent } from '@components/login/forgot-password-component/forgot-password.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock } from '@tests/login-service.mock';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/primeng';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let de: DebugElement;

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
            providers: [{ provide: LoginService, useClass: LoginServiceMock }]
        });

        fixture = DOTTestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        this.loginService = de.injector.get(LoginService);
        // spyOn(this.loginService, 'getLoginFormInfo').and.returnValue(of(mockLoginFormResponse));
        fixture.detectChanges();

        this.requestPasswordButton = de.query(By.css('button[type="submit"]'));
    });

    it('should focus the email/username input on load', function() {
        expect(component.emailInput.nativeElement).toBe(document.activeElement);
    });

    it('should keep recover password button disabled until the form is valid', () => {
        expect(this.requestPasswordButton.nativeElement.disabled).toBe(true);
    });

    it('should emit the request password correctly', () => {
        component.forgotPasswordForm.setValue({ login: 'test' });
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(component, 'ok').and.callThrough();
        spyOn(component.recoverPassword, 'emit');
        fixture.detectChanges();

        expect(this.requestPasswordButton.nativeElement.disabled).toBeFalsy();

        this.requestPasswordButton.triggerEventHandler('click', {});

        expect(component.ok).toHaveBeenCalled();
        expect(component.recoverPassword.emit).toHaveBeenCalledWith('test');
    });

    it('should show error message for required form fields', () => {
        component.forgotPasswordForm.get('login').markAsDirty();
        fixture.detectChanges();

        const erroreMessages = de.queryAll(By.css('.ui-messages-error'));
        expect(erroreMessages.length).toBe(1);
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
