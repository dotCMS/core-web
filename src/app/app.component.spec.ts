import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { DOTTestBed } from './test/dot-test-bed';
import { NotLicensedService } from './api/services/not-licensed-service';
import { DotMenuService } from './api/services/dot-menu.service';
import { LoginService, SocketFactory } from 'dotcms-js/dotcms-js';
import { DotDialogService } from './api/services/dot-dialog';

describe('AppComponent', () => {
    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'test', component: AppComponent }])],
            providers: [
                LoginService,
                NotLicensedService,
                DotMenuService,
                SocketFactory,
                DotDialogService
            ]
        });
    });

    it(
        'should have router-outlet',
        async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            const de: DebugElement = fixture.debugElement.query(By.css('router-outlet'));
            expect(de).not.toBeNull();
        })
    );
});
