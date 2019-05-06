import { DotRouterService } from './dot-router.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'dotcms-js';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

class RouterMock {
    url = '/c/test';

    routerState = {
        snapshot: {
            url: '/c/hello-world'
        }
    };

    navigate = jasmine.createSpy('navigate').and.callFake(() => {
        return new Promise((resolve) => {
            resolve(true);
        });
    });
}

describe('DotRouterService', () => {
    let service: DotRouterService;
    let router: Router;

    beforeEach(async(() => {
        const testbed = DOTTestBed.configureTestingModule({
            providers: [
                {
                    provide: LoginService,
                    useValue: {}
                },
                {
                    provide: Router,
                    useClass: RouterMock
                }
            ],
            imports: [RouterTestingModule]
        });

        service = testbed.get(DotRouterService);
        router = testbed.get(Router);
    }));

    it('should go to main', () => {
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
        service.goToMain();

        expect(router.navigate).toHaveBeenCalledWith(['test/fake']);
    });

    it('should go to edit page', () => {
        service.goToEditPage('abc/def');
        expect(router.navigate).toHaveBeenCalledWith(['/edit-page/content'], {
            queryParams: { url: 'abc/def' }
        });
    });

    it('should go to edit page with language_id', () => {
        service.goToEditPage('abc/def', '1');
        expect(router.navigate).toHaveBeenCalledWith(['/edit-page/content'], {
            queryParams: { url: 'abc/def', language_id: '1' }
        });
    });

    it('should go to edit contentlet', () => {
        service.goToEditContentlet('123');
        expect(router.navigate).toHaveBeenCalledWith(['/c/hello-world/123']);
    });

    it('should go to edit workflow task', () => {
        service.goToEditTask('123');
        expect(router.navigate).toHaveBeenCalledWith(['/c/workflow/123']);
    });

    it('should return true if a portlet is jsp', () => {
        expect(service.isJSPPortlet()).toBeTruthy();
    });

    it('should return true if edit page url', () => {
        router.routerState.snapshot.url = 'edit-page';
        expect(service.isEditPage()).toBe(true);
    });

    it('should return true if the portletid is a custom portlet', () => {
        expect(service.isCustomPortlet('c_testing')).toBe(true);
    });

    it('should return false if the portletid is not a custom portlet', () => {
        expect(service.isCustomPortlet('site-browser')).toBe(false);
    });

    it('should return false if the currentPortlet is not a custom portlet', () => {
        expect(service.isCustomPortlet('site-browser')).toBe(false);
    });


    it('should return true if the currentPortlet is not a custom portlet', () => {
        router.routerState.snapshot.url = '/c/c-testing';
        expect(service.isCustomPortlet('site-browser')).toBe(false);
    });
});
