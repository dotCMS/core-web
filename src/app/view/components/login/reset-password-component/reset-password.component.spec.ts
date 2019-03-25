import { ResetPasswordComponent } from '@components/login/reset-password-component/reset-password.component';
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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                ButtonModule,
                InputTextModule,
                DotFieldValidationMessageModule
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

        fixture = DOTTestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        this.loginService = de.injector.get(LoginService);
        spyOn(component, 'submitResetForm').and.callThrough();
        spyOn(component.changePassword, 'emit');
        fixture.detectChanges();

        this.changePasswordButton = de.query(By.css('button[type="submit"]'));
    });

    it('should keep change password button disabled until the form is valid', () => {
        expect(this.changePasswordButton.nativeElement.disabled).toBe(true);
    });

    it('should display message if passwords do not match', () => {
        component.resetPasswordForm.setValue({
            password: 'test',
            confirmPassword: 'test2'
        });
        this.changePasswordButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        const erroresMessages = de.queryAll(By.css('.error-message'));

        expect(erroresMessages.length).toBe(1);
        expect(component.submitResetForm).toHaveBeenCalledTimes(1);
        expect(component.changePassword.emit).not.toHaveBeenCalled();
    });

    it('should emit the change password correctly', () => {
        component.resetPasswordForm.setValue({
            password: 'test',
            confirmPassword: 'test'
        });
        this.changePasswordButton.triggerEventHandler('click', {});

        expect(component.submitResetForm).toHaveBeenCalledTimes(1);
        expect(component.changePassword.emit).toHaveBeenCalledTimes(1);
    });

    it('should show error message for required form fields', () => {
        component.resetPasswordForm.get('password').markAsDirty();
        component.resetPasswordForm.get('confirmPassword').markAsDirty();
        fixture.detectChanges();

        const errorMessages = de.queryAll(By.css('.ui-messages-error'));
        expect(errorMessages.length).toBe(2);
    });
});
