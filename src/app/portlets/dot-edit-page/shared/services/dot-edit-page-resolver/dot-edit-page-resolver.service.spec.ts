import { mockDotRenderedPage } from './../../../../../test/dot-rendered-page.mock';
import { Observable } from 'rxjs/Observable';
import { DotContentletLockerService } from './../../../../../api/services/dot-contentlet-locker/dot-contentlet-locker.service';
import { DotRenderHTMLService } from './../../../../../api/services/dot-render-html/dot-render-html.service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotEditPageResolver } from './dot-edit-page-resolver.service';
import { DotHttpErrorManagerService } from '../../../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { DotPageStateService } from '../../../content/services/dot-page-state/dot-page-state.service';
import { DotRouterService } from './../../../../../api/services/dot-router/dot-router.service';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock, mockUser } from './../../../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { async } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DotRenderedPageState } from '../../models/dot-rendered-page-state.model';
import { mockResponseView } from '../../../../../test/response-view.mock';

const route: any = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['toString']);

route.queryParams = {};

describe('DotEditPageResolver', () => {
    let resolver: DotEditPageResolver;
    let dotPageStateService: DotPageStateService;
    let dotRenderHTMLService: DotRenderHTMLService;
    let dotHttpErrorManagerService: DotHttpErrorManagerService;
    let dotRouterService: DotRouterService;

    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [
                    DotHttpErrorManagerService,
                    DotPageStateService,
                    DotRouterService,
                    DotEditPageResolver,
                    DotRenderHTMLService,
                    DotContentletLockerService,
                    {
                        provide: ActivatedRouteSnapshot,
                        useValue: route
                    },
                    {
                        provide: LoginService,
                        useClass: LoginServiceMock
                    }
                ],
                imports: [RouterTestingModule]
            });

            resolver = testbed.get(DotEditPageResolver);
            dotPageStateService = testbed.get(DotPageStateService);
            dotRenderHTMLService = testbed.get(DotRenderHTMLService);
            dotHttpErrorManagerService = testbed.get(DotHttpErrorManagerService);
            dotRouterService = testbed.get(DotRouterService);
        })
    );

    describe('content', () => {
        beforeEach(() => {
            route.queryParams.url = 'edit-page/content';
            route.children = [
                {
                    url: [
                        {
                            path: 'content'
                        }
                    ]
                }
            ];
        });

        it('should return a DotRenderedPageState valid object', () => {
            spyOn(dotPageStateService, 'get').and.returnValue(Observable.of(new DotRenderedPageState(mockDotRenderedPage, null, mockUser)));

            resolver.resolve(route).subscribe((res) => {
                expect(res).toEqual(new DotRenderedPageState(mockDotRenderedPage, null, mockUser));
            });
        });

        it('should return handle 403', () => {
            const fake403Response = mockResponseView(403);

            spyOn(dotHttpErrorManagerService, 'handle').and.returnValue(Observable.of({
                redirected: true
            }));
            spyOn(dotPageStateService, 'get').and.returnValue(Observable.throw(fake403Response));

            resolver.resolve(route).subscribe();
            expect(dotHttpErrorManagerService.handle).toHaveBeenCalledWith(fake403Response);
        });

        it('should redirect to site-browser', () => {
            const fake403Response = mockResponseView(403);

            spyOn(dotHttpErrorManagerService, 'handle').and.returnValue(Observable.of({
                redirected: false
            }));
            spyOn(dotPageStateService, 'get').and.returnValue(Observable.throw(fake403Response));

            spyOn(dotRouterService, 'gotoPortlet');

            resolver.resolve(route).subscribe();
            expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('/c/site-browser');
        });
    });

    describe('layout', () => {
        beforeEach(() => {
            route.queryParams.url = 'edit-page/layout';
            route.children = [
                {
                    url: [
                        {
                            path: 'layout'
                        }
                    ]
                }
            ];
        });

        it('should return a DotRenderedPageState valid object', () => {
            spyOn(dotPageStateService, 'get').and.returnValue(Observable.of(new DotRenderedPageState(mockDotRenderedPage, null, mockUser)));

            resolver.resolve(route).subscribe((res) => {
                expect(res).toEqual(new DotRenderedPageState(mockDotRenderedPage, null, mockUser));
            });
        });

        it('should trigger 403 error when try to go to layout because user canEdit page', () => {
            spyOn(dotPageStateService, 'get').and.returnValue(Observable.of(new DotRenderedPageState({
                ...mockDotRenderedPage,
                page: {
                    ...mockDotRenderedPage.page,
                    canEdit: false
                }
            }, null, mockUser)));


            spyOn(dotHttpErrorManagerService, 'handle').and.returnValue(Observable.of({
                redirected: false
            }));

            spyOn(dotRouterService, 'gotoPortlet');

            resolver.resolve(route).subscribe();
            expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('/c/site-browser');

        });
    });
});
