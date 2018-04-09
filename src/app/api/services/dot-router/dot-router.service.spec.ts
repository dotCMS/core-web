import { DotRouterService } from './dot-router.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { async } from 'q';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'dotcms-js/core/login.service';
import { Router } from '@angular/router';
import { DotRenderedPageState } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { PageMode } from '../../../portlets/dot-edit-page/shared/models/page-mode.enum';
import { mockDotPage, mockDotLayout } from '../../../test/dot-rendered-page.mock';
import { mockUser } from '../../../test/login-service.mock';

describe('DotRouterService', () => {
    let service: DotRouterService;
    let router: Router;

    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [
                    {
                        provide: LoginService,
                        useValue: {}
                    }
                ],
                imports: [RouterTestingModule]
            });

            service = testbed.get(DotRouterService);
            router = testbed.get(Router);
        })
    );

    describe('goToMain()', () => {
        it('should go to /', () => {
            spyOn(router, 'navigate');
            service.goToMain();

            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should go to edit page', () => {
            spyOn(service, 'goToEditPage');
            service.goToMain('/about/us');

            expect(service.goToEditPage).toHaveBeenCalledWith('/about/us');
        });

        it('should go to previousSavedURL', () => {
            service.previousSavedURL = 'test/fake';

            spyOn(router, 'navigate').and.callFake(() => {
                return new Promise((resolve) => {
                    resolve(true);
                });
            });
            service.goToMain();

            expect(router.navigate).toHaveBeenCalledWith(['test/fake']);
        });
    });

    describe('goToEditPage()', () => {
        it('should go to edit page', () => {
            spyOn(router, 'navigate');
            service.goToEditPage('abc/def');
            expect(router.navigate).toHaveBeenCalledWith(['/edit-page/content'], { queryParams: { url: 'abc/def' } });
        });
    });

    describe('goToEditPage()', () => {
        it('should go to edit page', () => {
            spyOn(router, 'navigateByData');

            const dotRenderedPageState = new DotRenderedPageState(
                mockUser,
                {
                    page: mockDotPage,
                    html: '',
                    layout: mockDotLayout,
                    canCreateTemplate: true,
                    viewAs: null
                },
                PageMode.PREVIEW
            );

            service.goToPage(dotRenderedPageState);
            expect(router.navigateByData).toHaveBeenCalledWith({
                url: ['/edit-page/content'],
                data: dotRenderedPageState,
                extras: { queryParams: { url: mockDotPage.pageURI } }
            });
        });

    });
});
