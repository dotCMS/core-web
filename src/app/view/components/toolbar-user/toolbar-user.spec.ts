import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Jsonp } from '@angular/http';
import { GravatarService } from './../../../api/services/gravatar-service';
import { IframeOverlayService } from './../_common/iframe/service/iframe-overlay.service';
import { DataListModule, OverlayPanelModule } from 'primeng/primeng';
import { MaterialDesignTextfieldDirective } from './../../directives/md-inputtext/md-input-text.directive';
import { SearchableDropdownComponent } from './../_common/searchable-dropdown/component/searchable-dropdown.component';
import { DotDropdownComponent } from './../_common/dropdown-component/dot-dropdown.component';
import { MyAccountComponent } from './../my-account/dot-my-account-component';
import { LoginAsComponent } from './../login-as/login-as';
import { GravatarComponent } from './../_common/gravatar/gravatar.component';
import { By } from '@angular/platform-browser';
import { ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement, Injectable } from '@angular/core';
import { async } from '@angular/core/testing';

import { LoginService } from 'dotcms-js/core/login.service';

import { DOTTestBed } from '../../../test/dot-test-bed';
import { LoginServiceMock, mockAuth } from '../../../test/login-service.mock';
import { ToolbarUserComponent } from './toolbar-user';
import { DotNavigationService } from '../dot-navigation/dot-navigation.service';

@Injectable()
class MockDotNavigationService {
    goToFirstPortlet() {}
    reloadIframePage() {}
}
describe('ToolbarUserComponent', () => {
    let comp: ToolbarUserComponent;
    let fixture: ComponentFixture<ToolbarUserComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let dotDropdownComponent: DotDropdownComponent;
    let dotNavigationService: DotNavigationService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DotDropdownComponent,
                GravatarComponent,
                LoginAsComponent,
                MyAccountComponent,
                SearchableDropdownComponent,
                ToolbarUserComponent,
                MaterialDesignTextfieldDirective
            ],
            providers: [
                { provide: LoginService, useClass: LoginServiceMock },
                {
                    provide: DotNavigationService,
                    useClass: MockDotNavigationService
                },
                IframeOverlayService,
                GravatarService,
                Jsonp
            ],
            imports: [DataListModule, OverlayPanelModule, BrowserAnimationsModule]
        });

        fixture = DOTTestBed.createComponent(ToolbarUserComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        dotNavigationService = de.injector.get(DotNavigationService);
    }));

    it(
        'should call redirect to the first porlet when logout as happen and same porlet is being loaded',
        fakeAsync(() => {
            comp.auth = mockAuth;
            fixture.detectChanges();

            dotDropdownComponent = de.query(By.css('dot-dropdown-component')).componentInstance;
            dotDropdownComponent.onToggle();
            spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(Promise.resolve(null));
            spyOn(dotNavigationService, 'reloadIframePage');
            fixture.detectChanges();

            const logoutAsLink = de.query(By.css('#dot-toolbar-user-link-logout-as'));
            logoutAsLink.nativeElement.click();

            tick();
            expect(dotNavigationService.goToFirstPortlet).toHaveBeenCalledTimes(1);
            expect(dotNavigationService.reloadIframePage).toHaveBeenCalledTimes(1);
        })
    );

    it(
        'should not call redirect to the first porlet when logout as happen and different porlet is being loaded',
        fakeAsync(() => {
            comp.auth = mockAuth;
            fixture.detectChanges();

            dotDropdownComponent = de.query(By.css('dot-dropdown-component')).componentInstance;
            dotDropdownComponent.onToggle();
            spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(Promise.resolve(true));
            spyOn(dotNavigationService, 'reloadIframePage');
            fixture.detectChanges();

            const logoutAsLink = de.query(By.css('#dot-toolbar-user-link-logout-as'));
            logoutAsLink.nativeElement.click();

            tick();
            expect(dotNavigationService.goToFirstPortlet).toHaveBeenCalledTimes(1);
            expect(dotNavigationService.reloadIframePage).toHaveBeenCalledTimes(0);
        })
    );
});
