import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';


import { AppComponent } from './app.component';
import { DOTTestBed } from './test/dot-test-bed';
import { NotLicensedService } from './api/services/not-licensed-service';
import { RoutingService } from './api/services/routing-service';
import { LoginService } from './api/services/login-service';
import { SocketFactory } from './api/services/protocol/socket-factory';
import { DotRouterService } from './api/services/dot-router-service';

describe('AppComponent', () => {
    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'test', component: AppComponent }])],
            providers: [
                DotRouterService,
                LoginService,
                NotLicensedService,
                RoutingService,
                SocketFactory
            ]
        });
    });

    it(
        'should have router-outlet',
        async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            const app = fixture.debugElement.componentInstance;
            const de: DebugElement = fixture.debugElement.query(By.css('router-outlet'));
            expect(de).not.toBeNull();
        })
    );
});
