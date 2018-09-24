import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { DOTTestBed } from './test/dot-test-bed';
import { NotLicensedService } from './api/services/not-licensed-service';
import { DotMenuService } from './api/services/dot-menu.service';
import { LoginService, SocketFactory } from 'dotcms-js/dotcms-js';
import { DotAlertConfirmService } from './api/services/dot-alert-confirm';
import { DotUiColorsService } from './api/services/dot-ui-colors/dot-ui-colors.service';
import { DotcmsConfig } from 'dotcms-js/dotcms-js';
import { of } from 'rxjs';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let dotCmsConfig: DotcmsConfig;
    let dotUiColorsService: DotUiColorsService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule],
            providers: [NotLicensedService]
        });

        fixture = DOTTestBed.createComponent(AppComponent);
        de = fixture.debugElement;
        dotCmsConfig = de.injector.get(DotcmsConfig);
        dotUiColorsService = de.injector.get(DotUiColorsService);

        spyOn(dotCmsConfig, 'getConfig').and.returnValue(
            of({
                colors: {
                    primary: '#123',
                    secondary: '#456',
                    background: '#789'
                }
            })
        );

        spyOn(dotUiColorsService, 'setColors');

        fixture.detectChanges();
    });

    it('should have router-outlet', () => {
        expect(de.query(By.css('router-outlet')) !== null).toBe(true);
    });

    it('should set ui colors', () => {
        expect(dotUiColorsService.setColors).toHaveBeenCalledWith(jasmine.any(HTMLElement), {
            primary: '#123',
            secondary: '#456',
            background: '#789'
        });
    });
});
