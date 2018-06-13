import { mockUser } from './../../../../test/login-service.mock';
import { mockDotRenderedPage } from './../../../../test/dot-rendered-page.mock';
import { PageViewService } from '../../../../api/services/page-view/page-view.service';
import { async, ComponentFixture } from '@angular/core/testing';

import { DotEditPageMainComponent } from './dot-edit-page-main.component';
import { DotEditPageNavModule } from '../dot-edit-page-nav/dot-edit-page-nav.module';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotEditPageNavComponent } from '../dot-edit-page-nav/dot-edit-page-nav.component';
import { PageViewServiceMock } from '../../../../test/page-view.mock';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { DotContentletEditorService } from '../../../../view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { Injectable } from '@angular/core';
import { DotPageStateService } from '../../content/services/dot-page-state/dot-page-state.service';

@Injectable()
class MockDotContentletEditorService {
    edit = jasmine.createSpy('edit');
    close$ = new Observable(observer => {
        observer.next(true);
    });
}

@Injectable()
class MockDotPageStateService {
    reload = jasmine.createSpy('reload').and.returnValue(Observable.of(new DotRenderedPageState(mockUser, mockDotRenderedPage)));
}

describe('DotEditPageMainComponent', () => {
    let component: DotEditPageMainComponent;
    let fixture: ComponentFixture<DotEditPageMainComponent>;
    let route: ActivatedRoute;
    let dotContentletEditorService: DotContentletEditorService;
    let dotPageStateService: DotPageStateService;

    const messageServiceMock = new MockDotMessageService({
        'editpage.toolbar.nav.content': 'Content',
        'editpage.toolbar.nav.layout': 'Layout'
    });

    const mockDotRenderedPageState: DotRenderedPageState = new DotRenderedPageState(mockUser, mockDotRenderedPage);

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        component: DotEditPageMainComponent,
                        path: ''
                    }
                ]),
                DotEditPageNavModule
            ],
            declarations: [DotEditPageMainComponent],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: PageViewService, useClass: PageViewServiceMock },
                {
                    provide: DotContentletEditorService,
                    useClass: MockDotContentletEditorService
                },
                {
                    provide: DotPageStateService,
                    useClass: MockDotPageStateService
                }
            ]
        });
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotEditPageMainComponent);
        route = fixture.debugElement.injector.get(ActivatedRoute);
        route.data = Observable.of({
            content: mockDotRenderedPageState
        });
        component = fixture.componentInstance;
        dotContentletEditorService = fixture.debugElement.injector.get(DotContentletEditorService);
        dotPageStateService = fixture.debugElement.injector.get(DotPageStateService);
        fixture.detectChanges();
    });

    it('should have router-outlet', () => {
        expect(fixture.debugElement.query(By.css('router-outlet'))).not.toBeNull();
    });

    it('should have dot-edit-page-nav', () => {
        expect(fixture.debugElement.query(By.css('dot-edit-page-nav'))).not.toBeNull();
    });

    it('should bind correctly pageState param', () => {
        const nav: DotEditPageNavComponent = fixture.debugElement.query(By.css('dot-edit-page-nav')).componentInstance;
        expect(nav.pageState).toEqual(mockDotRenderedPageState);
    });

    it('should call the ContentletEditorService Edit when OpenProperties evt happens', () => {
        const buttonClicked = { inode: '123', label: 'Properties' };
        const reponse = {
            data: {
                inode: buttonClicked.inode
            }
        };
        component.openPageProperties(buttonClicked);
        expect(dotContentletEditorService.edit).toHaveBeenCalledWith(reponse);
    });

    it('should call reload pageSte when IframeClose evt happens', () => {
        expect(dotPageStateService.reload).toHaveBeenCalled();
    });
});
