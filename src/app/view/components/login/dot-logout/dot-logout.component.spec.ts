import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotLogoutComponent } from './dot-logout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { DotLoginPageStateService } from '@components/login/shared/services/dot-login-page-state.service';
import { MockDotLoginPageStateService } from '@components/login/dot-login-page-resolver.service.spec';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DotLogoutComponent', () => {
    let fixture: ComponentFixture<DotLogoutComponent>;
    let de: DebugElement;
    let dotRouterService: DotRouterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DotLogoutComponent],
            imports: [BrowserAnimationsModule, ButtonModule],
            providers: [
                { provide: DotRouterService, useClass: MockDotRouterService },
                { provide: DotLoginPageStateService, useClass: MockDotLoginPageStateService }
            ]
        });

        TestBed.configureTestingModule({
            declarations: [DotLogoutComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotLogoutComponent);
        dotRouterService = TestBed.get(DotRouterService);
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should load form labels correctly', () => {
        const header: DebugElement = de.query(By.css('h3'));
        const message: DebugElement = de.query(By.css('p'));
        const button: DebugElement = de.query(By.css('button'));

        expect(header.nativeElement.innerHTML).toEqual('Logout');
        expect(message.nativeElement.innerHTML).toEqual(
            'You are logout successfully, click the button to login'
        );
        expect(button.nativeElement.innerHTML).toContain('Sign In');
    });

    it('should go to login page on sing-in', () => {
        const button: DebugElement = de.query(By.css('button'));
        button.triggerEventHandler('click', {});
        expect(dotRouterService.goToLogin).toHaveBeenCalledTimes(1);
    });
});
