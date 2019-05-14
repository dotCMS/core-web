import { Injectable } from '@angular/core';

@Injectable()
export class MockDotRouterService {
    get currentPortlet() {
        return  {
            url: 'this/is/an/url',
            id: '123-567'
        };
    }
    getPortletId = jasmine.createSpy('getPortletId').and.returnValue('test');
    goToEditContentType = jasmine.createSpy('goToEditContentType');
    goToEditContentlet = jasmine.createSpy('goToEditContentlet');
    goToEditPage = jasmine.createSpy('goToEditPage');
    goToForgotPassword = jasmine.createSpy('goToForgotPassword');
    goToLogin = jasmine.createSpy('goToLogin');
    goToMain = jasmine.createSpy('goToMain');
    gotoPortlet = jasmine.createSpy('gotoPortlet').and.callFake(
        () => new Promise((resolve) => resolve(true))
    );
    goToSiteBrowser = jasmine.createSpy('goToSiteBrowser');
    reloadCurrentPortlet = jasmine.createSpy('reloadCurrentPortlet');
}
