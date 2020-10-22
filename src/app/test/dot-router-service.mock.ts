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

    get queryParams() {
        return {};
    }

    replaceQueryParams = jasmine.createSpy('replaceQueryParams');
    getPortletId = jasmine.createSpy('getPortletId').and.returnValue('test');
    goToEditContentType = jasmine.createSpy('goToEditContentType');
    goToEditContentlet = jasmine.createSpy('goToEditContentlet');
    goToEditPage = jasmine.createSpy('goToEditPage');
    goToEditTask = jasmine.createSpy('goToEditTask');
    goToForgotPassword = jasmine.createSpy('goToForgotPassword');
    goToLogin = jasmine.createSpy('goToLogin');
    doLogOut = jasmine.createSpy('doLogOut');
    goToMain = jasmine.createSpy('goToMain');
    gotoPortlet = jasmine
        .createSpy('gotoPortlet')
        .and.callFake(() => new Promise((resolve) => resolve(true)));
    goToAppsConfiguration = jasmine.createSpy('goToAppsConfiguration');
    goToUpdateAppsConfiguration = jasmine.createSpy('goToUpdateAppsConfiguration');
    goToSiteBrowser = jasmine.createSpy('goToSiteBrowser');
    isCurrentPortletCustom = jasmine.createSpy('isCurrentPortletCustom');
    isJSPPortlet = jasmine.createSpy('isJSPPortlet');
    reloadCurrentPortlet = jasmine.createSpy('reloadCurrentPortlet');
    isEditPage() {}
}
