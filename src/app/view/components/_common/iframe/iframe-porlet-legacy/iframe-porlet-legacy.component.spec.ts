import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DotMenuService } from '@services/dot-menu.service';
import { IFrameModule } from '../index';
import { IframePortletLegacyComponent } from './iframe-porlet-legacy.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
    SiteService,
    LoginService,
    DotPushPublishDialogService,
    CoreWebService,
    ApiRoot,
    LoggerService,
    StringUtils,
    DotcmsEventsService,
    DotEventsSocket,
    DotEventsSocketURL,
    DotcmsConfigService
} from 'dotcms-js';
import { DotCustomEventHandlerService } from '@services/dot-custom-event-handler/dot-custom-event-handler.service';
import { DotContentTypeService } from '@services/dot-content-type/dot-content-type.service';
import { LoginServiceMock } from '@tests/login-service.mock';
import { CoreWebServiceMock } from 'projects/dotcms-js/src/lib/core/core-web.service.mock';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { DotContentletEditorService } from '@components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { dotEventSocketURLFactory, MockDotUiColorsService } from '@tests/dot-test-bed';
import { DotIframeService } from '@components/_common/iframe/service/dot-iframe/dot-iframe.service';
import { DotDownloadBundleDialogService } from '@services/dot-download-bundle-dialog/dot-download-bundle-dialog.service';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { FormatDateService } from '@services/format-date-service';
import { SiteServiceMock } from '@tests/site-service.mock';

const routeDatamock = {
    canAccessPortlet: true
};

class ActivatedRouteMock {
    get data() {
        return of(routeDatamock);
    }

    get parent() {
        return {
            url: of([
                {
                    path: 'an-url'
                }
            ])
        };
    }
}

describe('IframePortletLegacyComponent', () => {
    let comp: IframePortletLegacyComponent;
    let fixture: ComponentFixture<IframePortletLegacyComponent>;
    let de: DebugElement;
    let dotIframe: DebugElement;
    let dotMenuService: DotMenuService;
    let dotCustomEventHandlerService: DotCustomEventHandlerService;
    let route: ActivatedRoute;
    const siteServiceMock = new SiteServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [IFrameModule, RouterTestingModule],
            providers: [
                DotContentTypeService,
                DotCustomEventHandlerService,
                DotPushPublishDialogService,
                DotMenuService,
                { provide: LoginService, useClass: LoginServiceMock },
                { provide: SiteService, useValue: siteServiceMock },
                { provide: ActivatedRoute, useClass: ActivatedRouteMock },
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                Http,
                { provide: ConnectionBackend, useClass: MockBackend },
                { provide: RequestOptions, useClass: BaseRequestOptions },
                { provide: DotRouterService, useClass: MockDotRouterService },
                { provide: DotUiColorsService, useClass: MockDotUiColorsService },
                ApiRoot,
                DotContentletEditorService,
                DotIframeService,
                DotDownloadBundleDialogService,
                LoggerService,
                StringUtils,
                DotcmsEventsService,
                DotEventsSocket,
                { provide: DotEventsSocketURL, useFactory: dotEventSocketURLFactory },
                DotcmsConfigService,
                DotLicenseService,
                FormatDateService
            ]
        });

        fixture = TestBed.createComponent(IframePortletLegacyComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        dotMenuService = TestBed.get(DotMenuService);
        dotCustomEventHandlerService = TestBed.get(DotCustomEventHandlerService);
        route = de.injector.get(ActivatedRoute);
    });

    it('should set query param url to the dot-iframe src', () => {
        route.queryParams = of({ url: 'hello/world' });
        route.params = of({ id: 'portlet-id' });

        let src: string;
        comp.url.subscribe(url => {
            src = url;
        });

        fixture.detectChanges();

        expect(src).toEqual('hello/world');
    });

    it('should set router param id to the dot-iframe src', () => {
        route.queryParams = of({});
        route.params = of({ id: 'portlet-id' });

        spyOn(dotMenuService, 'getUrlById').and.returnValue(of('fake-url'));

        let src: string;

        comp.url.subscribe(url => {
            src = url;
        });

        fixture.detectChanges();

        expect(dotMenuService.getUrlById).toHaveBeenCalledWith('portlet-id');
        expect(src).toEqual('fake-url');
    });

    it('should handle custom events', () => {
        route.queryParams = of({ url: 'hello/world' });
        route.params = of({ id: 'portlet-id' });
        spyOn(dotCustomEventHandlerService, 'handle');
        fixture.detectChanges();

        dotIframe = de.query(By.css('dot-iframe'));

        dotIframe.triggerEventHandler('custom', {
            this: {
                is: 'a custom event'
            }
        });

        expect(dotCustomEventHandlerService.handle).toHaveBeenCalledWith({
            this: {
                is: 'a custom event'
            }
        });
    });

    it('should load Not Licensed component when no license and enterprise portlet ', () => {
        routeDatamock.canAccessPortlet = false;
        fixture.detectChanges();
        expect(de.query(By.css('dot-not-licensed-component'))).toBeTruthy();
    });

    it('should call reloadIframePortlet once', () => {
        fixture.detectChanges();
        comp.url.next('test');
        spyOn(comp, 'reloadIframePortlet');
        siteServiceMock.setFakeCurrentSite({
            identifier: '1',
            hostname: 'Site 1',
            archived: false,
            type: 'host'
        });
        siteServiceMock.setFakeCurrentSite({
            identifier: '2',
            hostname: 'Site 2',
            archived: false,
            type: 'host'
        });
        expect(comp.reloadIframePortlet).toHaveBeenCalledTimes(1);
    });
});
