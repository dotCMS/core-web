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
import { of } from 'rxjs';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';

fdescribe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let de: DebugElement;
    let loginPageStateService: LoginPageStateService;

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
                LoginPageStateService
            ]
        });

        fixture = DOTTestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        loginPageStateService = de.injector.get(LoginPageStateService);
        spyOn(component.changePassword, 'emit');
        spyOnProperty(loginPageStateService, 'dotLoginInformation', 'get').and.returnValue(
            of(mockLoginFormResponse)
        );
        fixture.detectChanges();

        this.changePasswordButton = de.query(By.css('button[type="submit"]'));
    });

    it('should load form labels correctly', () => {
        const header: DebugElement = de.query(By.css('h3'));
        const inputs: DebugElement[] = de.queryAll(By.css('input'));
        const button: DebugElement = de.query(By.css('button'));

        expect(header.nativeElement.innerHTML).toEqual('Password Reset');
        expect(inputs[0].nativeElement.placeholder).toContain('Enter Password');
        expect(inputs[1].nativeElement.placeholder).toContain('Confirm Password');
        expect(button.nativeElement.innerHTML).toContain('Change Password');
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
        const errorMessage = de.queryAll(By.css('.error-message'));

        expect(errorMessage.length).toBe(1);
        expect(component.changePassword.emit).not.toHaveBeenCalled();
    });

    it('should emit the change password correctly', () => {
        component.resetPasswordForm.setValue({
            password: 'test',
            confirmPassword: 'test'
        });
        this.changePasswordButton.triggerEventHandler('click', {});

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
