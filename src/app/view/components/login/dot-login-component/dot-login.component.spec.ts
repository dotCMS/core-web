import { DotLoginComponent } from '@components/login/dot-login-component/dot-login.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock } from '@tests/login-service.mock';

fdescribe('DotLoginComponent', () => {
    let component: DotLoginComponent;
    let fixture: ComponentFixture<DotLoginComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotLoginComponent],
            imports: [BrowserAnimationsModule],
            providers: [{ provide: LoginService, useClass: LoginServiceMock }]
        });

        fixture = DOTTestBed.createComponent(DotLoginComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
    });

    it('should focus the email input on load', () => {});

    it('should change language', () => {});

    it('should navigate to recover password screen', () => {});

    describe('form validation', () => {
        beforeEach(() => {});

        it('should load initial value of the form', () => {});
        it('should show error message for required form fields', () => {});
        it('should keep submit button disabled until the form is valid', () => {});
        it('should show error messages on login failure', () => {});
        it('should submit login request correctly', () => {});
    });
});
