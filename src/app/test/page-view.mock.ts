import { Observable } from 'rxjs/Observable';
import { DotPageView } from '../portlets/dot-edit-page/shared/models/dot-page-view.model';
import { dotPageMock, mockDotLayout, mockDotContainers, mockDotTemplate } from './dot-rendered-page.mock';

export const fakePageView: DotPageView = {
    containers:  mockDotContainers,
    page: dotPageMock,
    layout: mockDotLayout,
    template: mockDotTemplate,
    canEditTemplate: true
};

export class PageViewServiceMock {
    get() {
        return Observable.of(fakePageView);
    }
}
