import { mockUser, LoginServiceMock } from './../../../test/login-service.mock';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Injectable } from '@angular/core';
import { LoginAsComponent } from './login-as';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { SEARCHABLE_NGFACES_MODULES, SearchableDropDownModule } from '../_common/searchable-dropdown/searchable-dropdown.module';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { LoginService, User } from 'dotcms-js/dotcms-js';
import { PaginatorService } from '../../../api/services/paginator';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InputTextModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotNavigationService } from '../dot-navigation/dot-navigation.service';
import { DotEventsService } from '../../../api/services/dot-events/dot-events.service';

@Injectable()
class MockDotNavigationService {
    goToFirstPortlet() {}
}

describe('LoginAsComponent', () => {
    let comp: LoginAsComponent;
    let fixture: ComponentFixture<LoginAsComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let paginatorService: PaginatorService;
    let loginService: LoginService;
    let dotNavigationService: DotNavigationService;
    let dotEventsService: DotEventsService;

    const users: User[] = [
        {
            emailAddress: 'a@a.com',
            firstName: 'user_first_name',
            lastName: 'user_lastname',
            loggedInDate: 1,
            name: 'user 1',
            userId: '1'
        }
    ];

    beforeEach(async(() => {
        const messageServiceMock = new MockDotMessageService({
            Change: 'Change',
            cancel: 'cancel',
            'login-as': 'login-as',
            'loginas.select.loginas.user': 'loginas.select.loginas.user',
            password: 'password'
        });

        DOTTestBed.configureTestingModule({
            declarations: [LoginAsComponent],
            imports: [
                ...SEARCHABLE_NGFACES_MODULES,
                BrowserAnimationsModule,
                InputTextModule,
                ReactiveFormsModule,
                SearchableDropDownModule
            ],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: LoginService, useClass: LoginServiceMock },
                {
                    provide: DotNavigationService,
                    useClass: MockDotNavigationService
                },
                {
                    provide: ActivatedRoute,
                    useValue: { params: Observable.from([{ id: '1234' }]) }
                },
                PaginatorService,
                IframeOverlayService
            ]
        });

        fixture = DOTTestBed.createComponent(LoginAsComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        paginatorService = de.injector.get(PaginatorService);
        loginService = de.injector.get(LoginService);
        spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of(users));
        dotNavigationService = de.injector.get(DotNavigationService);
        dotEventsService = de.injector.get(DotEventsService);
    }));

    it('should load the first page', () => {
        comp.ngOnInit();
        fixture.detectChanges();

        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
        expect(paginatorService.url).toEqual('v2/users/loginAsData');
        expect(paginatorService.filter).toEqual('');
        expect(comp.userCurrentPage).toEqual(users);
    });

    it('should change page', () => {
        const searchableDropdown = de.query(By.css('dot-searchable-dropdown'));
        searchableDropdown.componentInstance.pageChange.emit({
            filter: 'filter',
            first: 1
        });

        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(1);
        expect(paginatorService.filter).toEqual('filter');
    });

    it('should change filter', () => {
        const searchableDropdown = de.query(By.css('dot-searchable-dropdown'));
        searchableDropdown.componentInstance.filterChange.emit('new filter');

        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
        expect(paginatorService.filter).toEqual('new filter');
    });

    it('should call "loginAs" in "LoginService" when login as happens', () => {
        spyOn(loginService, 'loginAs').and.callThrough();
        spyOn(dotEventsService, 'notify');
        comp.visible = true;
        comp.ngOnInit();
        fixture.detectChanges();
        comp.form.get('loginAsUser').setValue(mockUser);
        fixture.detectChanges();
        const button = de.query(By.css('#dot-login-as-button-change'));
        button.nativeElement.click();
        expect(loginService.loginAs).toHaveBeenCalledTimes(1);
        expect(dotEventsService.notify).toHaveBeenCalledWith('login-as');
    });

    it('should focus on Password input after an Error haapens in "loginAs" in "LoginService"', () => {
        spyOn(loginService, 'loginAs').and.returnValue(Observable.throw({ message: 'Error' }));
        comp.visible = true;
        comp.needPassword = true;
        comp.ngOnInit();
        fixture.detectChanges();
        comp.form.get('loginAsUser').setValue(mockUser);
        comp.form.get('password').setValue('password');
        fixture.detectChanges();
        const button = de.query(By.css('#dot-login-as-button-change'));
        const passwordInputElem = de.query(By.css('#dot-login-as-password'));
        spyOn(passwordInputElem.nativeElement, 'focus');
        button.nativeElement.click();
        expect(passwordInputElem.nativeElement.focus).toHaveBeenCalled();
    });
});
