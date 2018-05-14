import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
import { DotContentletService } from '../../../../../api/services/dot-contentlet.service';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { IFrameModule } from '../index';
import { IframePortletLegacyComponent } from './iframe-porlet-legacy.component';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketFactory, SiteService, LoginService } from 'dotcms-js/dotcms-js';
import { IframeComponent } from '../iframe-component';
import { DotLoadingIndicatorService } from '../dot-loading-indicator/dot-loading-indicator.service';
import { DotRouterService } from '../../../../../api/services/dot-router/dot-router.service';
import { DotContentletEditorService } from '../../../dot-contentlet-editor/services/dot-add-contentlet.service';

describe('IframePortletLegacyComponent', () => {
    let comp: IframePortletLegacyComponent;
    let fixture: ComponentFixture<IframePortletLegacyComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let dotIframe: DebugElement;
    let dotLoadingIndicatorService: DotLoadingIndicatorService;
    let dotMenuService: DotMenuService;
    let dotRouterService: DotRouterService;
    let dotContentletEditorService: DotContentletEditorService;
    let route: ActivatedRoute;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [],
            imports: [IFrameModule, RouterTestingModule],
            providers: [
                DotContentletEditorService,
                DotContentletService,
                DotMenuService,
                LoginService,
                SiteService,
                SocketFactory,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            url: Observable.of([
                                {
                                    path: 'an-url'
                                }
                            ])
                        }
                    }
                }
            ]
        });

        fixture = DOTTestBed.createComponent(IframePortletLegacyComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        dotIframe = de.query(By.css('dot-iframe'));
        dotLoadingIndicatorService = de.injector.get(DotLoadingIndicatorService);
        dotMenuService = de.injector.get(DotMenuService);
        dotRouterService = de.injector.get(DotRouterService);
        dotContentletEditorService = de.injector.get(DotContentletEditorService);
        route = de.injector.get(ActivatedRoute);
    }));

    it('should have dot-iframe component', () => {
        expect(fixture.debugElement.query(By.css('dot-iframe'))).toBeDefined();
    });

    it('should set query param url to the dot-iframe src', () => {
        route.queryParams = Observable.of({ url: 'hello/world' });
        route.params = Observable.of({ id: 'portlet-id' });

        let src: string;
        comp.url.subscribe((url) => {
            src = url;
        });

        fixture.detectChanges();

        expect(src).toEqual('hello/world');
    });

    it('should set router param id to the dot-iframe src', () => {
        route.queryParams = Observable.of({});
        route.params = Observable.of({ id: 'portlet-id' });

        spyOn(dotMenuService, 'getUrlById').and.returnValue(Observable.of('fake-url'));

        let src: string;

        comp.url.subscribe((url) => {
            src = url;
        });

        fixture.detectChanges();

        expect(dotMenuService.getUrlById).toHaveBeenCalledWith('portlet-id');
        expect(src).toEqual('fake-url');
    });

    describe('custom events from iframe', () => {
        it('should show loading indicator and go to edit page when event is emited by iframe', () => {
            spyOn(dotLoadingIndicatorService, 'show');
            spyOn(dotRouterService, 'goToEditPage');

            dotIframe.triggerEventHandler('custom', {
                detail: {
                    name: 'edit-page',
                    data: {
                        url: 'some/url'
                    }
                }
            });

            expect(dotLoadingIndicatorService.show).toHaveBeenCalledTimes(1);
            expect(dotRouterService.goToEditPage).toHaveBeenCalledWith('some/url');
        });

        it('should edit a contentlet', () => {
            spyOn(dotContentletEditorService, 'edit');

            dotIframe.triggerEventHandler('custom', {
                detail: {
                    name: 'edit-contentlet',
                    data: {
                        inode: '123'
                    }
                }
            });

            expect(dotContentletEditorService.edit).toHaveBeenCalledWith({
                inode: '123'
            });
        });
    });
});
