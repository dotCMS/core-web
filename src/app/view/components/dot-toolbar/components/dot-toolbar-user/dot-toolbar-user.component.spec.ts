import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IframeOverlayService } from '../../../_common/iframe/service/iframe-overlay.service';
import { DotDropdownComponent } from '../../../_common/dot-dropdown-component/dot-dropdown.component';
import { DotMyAccountComponent } from '../dot-my-account/dot-my-account.component';
import { DotLoginAsComponent } from '../dot-login-as/dot-login-as.component';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { async } from '@angular/core/testing';

import { LoginService } from 'dotcms-js';

import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { LoginServiceMock, mockAuth } from '../../../../../test/login-service.mock';
import { DotToolbarUserComponent } from './dot-toolbar-user.component';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Jsonp } from '@angular/http';
import { LOCATION_TOKEN } from 'src/app/providers';
import { DotMenuService } from '@services/dot-menu.service';
import { DotNavigationService } from '@components/dot-navigation/services/dot-navigation.service';
import { DotGravatarModule } from '../dot-gravatar/dot-gravatar.module';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';

describe('DotToolbarUserComponent', () => {
    let comp: DotToolbarUserComponent;
    let fixture: ComponentFixture<DotToolbarUserComponent>;
    let de: DebugElement;
    let dotDropdownComponent: DotDropdownComponent;
    let loginService: LoginService;
    let locationService: Location;
    let dotNavigationService: DotNavigationService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DotDropdownComponent,
                DotLoginAsComponent,
                DotMyAccountComponent,
                DotToolbarUserComponent
            ],
            providers: [
                {
                    provide: LOCATION_TOKEN,
                    useValue: {
                        reload() {}
                    }
                },
                { provide: LoginService, useClass: LoginServiceMock },
                IframeOverlayService,
                Jsonp,
                DotNavigationService,
                DotMenuService
            ],
            imports: [
                BrowserAnimationsModule,
                DotDialogModule,
                DotGravatarModule,
                DotIconButtonModule,
                DotIconModule,
                SearchableDropDownModule,
                RouterTestingModule,
                MdInputTextModule
            ]
        });

        fixture = DOTTestBed.createComponent(DotToolbarUserComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;

        loginService = de.injector.get(LoginService);
        locationService = de.injector.get(LOCATION_TOKEN);
        dotNavigationService = de.injector.get(DotNavigationService);

        comp.auth = mockAuth;
    }));

    it('should call "logoutAs" in "LoginService" on logout click', async(() => {
        spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(
            new Promise((resolve) => {
                resolve(true);
            })
        );
        spyOn(locationService, 'reload');
        spyOn(loginService, 'logoutAs').and.callThrough();

        fixture.detectChanges();

        dotDropdownComponent = de.query(By.css('dot-dropdown-component')).componentInstance;
        dotDropdownComponent.onToggle();
        fixture.detectChanges();

        const logoutAsLink = de.query(By.css('#dot-toolbar-user-link-logout-as'));
        logoutAsLink.triggerEventHandler('click', {
            preventDefault: () => {}
        });

        fixture.whenStable().then(() => {
            expect(loginService.logoutAs).toHaveBeenCalledTimes(1);
            expect(dotNavigationService.goToFirstPortlet).toHaveBeenCalledTimes(1);
            expect(locationService.reload).toHaveBeenCalledTimes(1);
        });
    }));

    afterEach(() => {
        // Removes dirty DOM after tests have finished
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
