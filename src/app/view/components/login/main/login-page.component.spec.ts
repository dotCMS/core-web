import { LoginPageComponent } from '@components/login/main/login-page.component';
import { ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockLoginFormResponse } from '@tests/login-service.mock';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/primeng';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { of } from 'rxjs';
import { DotLoginPageStateService } from '@components/login/shared/services/dot-login-page-state.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Injectable } from '@angular/core';

@Injectable()
class MockLoginPageStateService {
    get = jasmine.createSpy('get').and.returnValue(of(mockLoginFormResponse));
}

describe('LoginPageComponent', () => {
    let fixture: ComponentFixture<LoginPageComponent>;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [LoginPageComponent],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                ButtonModule,
                InputTextModule,
                DotFieldValidationMessageModule,
                RouterTestingModule
            ],
            providers: [
                {
                    provide: DotLoginPageStateService,
                    useClass: MockLoginPageStateService
                }
            ]
        });

        fixture = DOTTestBed.createComponent(LoginPageComponent);
        fixture.detectChanges();
    });

    it('should set the background Image and background color', () => {
        expect(document.body.style.backgroundColor).toEqual('rgb(58, 56, 71)');
        expect(document.body.style.backgroundImage).toEqual(
            'url("/html/images/backgrounds/bg-11.jpg")'
        );
    });
});
