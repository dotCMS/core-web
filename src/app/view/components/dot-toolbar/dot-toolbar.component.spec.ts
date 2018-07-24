import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Injectable, Component, Input } from '@angular/core';
import { ToolbarComponent } from './dot-toolbar.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { SiteService } from 'dotcms-js/dotcms-js';
import { DotRouterService } from '../../../api/services/dot-router/dot-router.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotNavigationService } from '../dot-navigation/dot-navigation.service';
import { SiteServiceMock, mockSites } from '../../../test/site-service.mock';
import { RouterTestingModule } from '../../../../../node_modules/@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockDotNavigationService {
    goToFirstPortlet() {}
}

@Injectable()
class MockRouterService {
    get snapshot() {
        return {
            _routerState: {
                url: 'any/url'
            }
        };
    }
}

@Component({
    selector: 'dot-site-selector',
    template: ''
})
class MockSiteSelectorComponent {
    @Input() archive = false;
    @Input() id = '';
    @Input() live = true;
    @Input() system = true;
}

@Component({
    selector: 'dot-global-message',
    template: ''
})
class MockGlobalMessageComponent {}

@Component({
    selector: 'dot-toolbar-notifications',
    template: ''
})
class MockToolbarNotificationsComponent {}

@Component({
    selector: 'dot-toolbar-user',
    template: ''
})
class MockToolbarUsersComponent {}

@Component({
    selector: 'dot-toolbar-add-contentlet',
    template: ''
})
class MockToolbarAddContentletComponent {}

describe('ToolbarComponent', () => {
    let dotRouterService: DotRouterService;
    let routeService: ActivatedRoute;
    let comp: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let de: DebugElement;

    const siteServiceMock = new SiteServiceMock();
    const siteMock = mockSites[0];

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                ToolbarComponent,
                MockSiteSelectorComponent,
                MockGlobalMessageComponent,
                MockToolbarNotificationsComponent,
                MockToolbarUsersComponent,
                MockToolbarAddContentletComponent
            ],
            imports: [BrowserAnimationsModule, RouterTestingModule],
            providers: [
                { provide: DotNavigationService, useClass: MockDotNavigationService },
                { provide: SiteService, useValue: siteServiceMock },
                { provide: ActivatedRoute, useClass: MockRouterService },
                IframeOverlayService
            ]
        });

        fixture = DOTTestBed.createComponent(ToolbarComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        dotRouterService = fixture.debugElement.injector.get(DotRouterService);
        routeService = fixture.debugElement.injector.get(ActivatedRoute);
    }));

    it(`should trigger "siteChange" call "goToFirstPorlet" in "DotRouterService" when the "siteChange" method is actioned`, () => {
        const siteSelector: DebugElement = fixture.debugElement.query(By.css('dot-site-selector'));
        spyOn(comp, 'siteChange').and.callThrough();
        spyOn(dotRouterService, 'goToSiteBrowser');
        fixture.detectChanges();
        siteSelector.triggerEventHandler('change', { value: siteMock });
        expect(dotRouterService.goToSiteBrowser).not.toHaveBeenCalled();
        expect(comp.siteChange).toHaveBeenCalledWith({ value: siteMock });
    });

    it(`should trigger "siteChange" call "goToFirstPorlet" in "DotRouterService" when the "siteChange" method
        is actioned and the url comes from Edit Page`, () => {
        const siteSelector: DebugElement = fixture.debugElement.query(By.css('dot-site-selector'));
        spyOn(comp, 'siteChange').and.callThrough();
        spyOn(dotRouterService, 'goToSiteBrowser');
        spyOnProperty(routeService, 'snapshot', 'get').and.returnValue({_routerState: {
            url: 'edit-page/content?url=about-us'
        }});
        siteSelector.triggerEventHandler('change', { value: siteMock });
        expect(dotRouterService.goToSiteBrowser).toHaveBeenCalled();
        expect(comp.siteChange).toHaveBeenCalledWith({ value: siteMock });
    });
});
