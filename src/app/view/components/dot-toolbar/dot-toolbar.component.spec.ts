import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Injectable, Component, Input } from '@angular/core';
import { ToolbarComponent } from './dot-toolbar.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { SiteService } from 'dotcms-js';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotNavigationService } from '../dot-navigation/services/dot-navigation.service';
import { SiteServiceMock, mockSites } from '../../../test/site-service.mock';
import { RouterTestingModule } from '../../../../../node_modules/@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { DotIconButtonModule } from '../_common/dot-icon-button/dot-icon-button.module';
import { DotIconModule } from '../_common/dot-icon/dot-icon.module';

@Injectable()
class MockDotNavigationService {
    collapsed = false;

    toggle() {
        this.collapsed = !this.collapsed;
    }
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
    @Input()
    archive = false;
    @Input()
    id = '';
    @Input()
    live = true;
    @Input()
    system = true;
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

@Component({
    selector: 'dot-crumbtrail',
    template: ''
})
class MockDotCrumbtrailComponent {}

describe('ToolbarComponent', () => {
    let dotRouterService: DotRouterService;
    let dotNavigationService: DotNavigationService;
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
                MockToolbarAddContentletComponent,
                MockDotCrumbtrailComponent
            ],
            imports: [
                BrowserAnimationsModule,
                RouterTestingModule,
                DotIconModule,
                DotIconButtonModule
            ],
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
        dotRouterService = de.injector.get(DotRouterService);
        dotNavigationService = de.injector.get(DotNavigationService);
        spyOn(comp, 'siteChange').and.callThrough();
    }));

    it(`should has a crumbtrail`, () => {
        fixture.detectChanges();

        const crumbtrail: DebugElement = fixture.debugElement.query(By.css('dot-crumbtrail'));
        expect(crumbtrail).not.toBeNull();
    });

    it(`should NOT go to site browser when site change in any portlet but edit page`, () => {
        const siteSelector: DebugElement = fixture.debugElement.query(By.css('dot-site-selector'));
        fixture.detectChanges();
        siteSelector.triggerEventHandler('change', { value: siteMock });
        expect(dotRouterService.goToSiteBrowser).not.toHaveBeenCalled();
        expect(comp.siteChange).toHaveBeenCalledWith({ value: siteMock });
    });

    it(`should go to site-browser when site change on edit page url`, () => {
        const siteSelector: DebugElement = fixture.debugElement.query(By.css('dot-site-selector'));
        spyOnProperty(dotRouterService, 'currentPortlet', 'get').and.returnValue({
            id: 'edit-page',
            url: ''
        });
        siteSelector.triggerEventHandler('change', { value: siteMock });

        expect(dotRouterService.goToSiteBrowser).toHaveBeenCalled();
        expect(comp.siteChange).toHaveBeenCalledWith({ value: siteMock });
    });

    it('should toggle menu and update icon on click', () => {
        spyOn(dotNavigationService, 'toggle').and.callThrough();
        const stopPro = jasmine.createSpy('stopPro');

        fixture.detectChanges();

        const button: DebugElement = de.query(By.css('dot-icon-button'));

        expect(button.componentInstance.icon).toEqual('arrow_back');

        button.triggerEventHandler('click', {
            stopPropagation: stopPro
        });

        fixture.detectChanges();

        expect(dotNavigationService.toggle).toHaveBeenCalledTimes(1);
        expect(stopPro).toHaveBeenCalledTimes(1);
        expect(button.componentInstance.icon).toEqual('menu');
    });
});
