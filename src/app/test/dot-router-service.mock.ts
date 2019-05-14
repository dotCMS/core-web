import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockDotRouterService {
    get currentPortlet() {
        return {
            url: 'this/is/an/url',
            id: '123-567'
        };
    }

    get portletReload$() {
        return of('some-id');
    }

    getPortletId = jasmine.createSpy('getPortletId').and.returnValue('test');
    goToEditContentType = jasmine.createSpy('goToEditContentType');
    goToEditContentlet = jasmine.createSpy('goToEditContentlet');
    goToEditPage = jasmine.createSpy('goToEditPage');
    goToEditTask = jasmine.createSpy('goToEditTask');
    goToForgotPassword = jasmine.createSpy('goToForgotPassword');
    goToLogin = jasmine.createSpy('goToLogin');
    goToMain = jasmine.createSpy('goToMain');
    gotoPortlet = jasmine
        .createSpy('gotoPortlet')
        .and.callFake(() => new Promise((resolve) => resolve(true)));
    goToSiteBrowser = jasmine.createSpy('goToSiteBrowser');
    isCurrentPortletCustom = jasmine.createSpy('isCurrentPortletCustom');
    reloadCurrentPortlet = jasmine.createSpy('reloadCurrentPortlet');
    isEditPage() {}
}
