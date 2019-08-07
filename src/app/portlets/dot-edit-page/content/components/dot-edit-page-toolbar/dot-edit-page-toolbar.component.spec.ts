import { LoginServiceMock } from './../../../../../test/login-service.mock';
import { LoginService } from 'dotcms-js';
import { async, ComponentFixture } from '@angular/core/testing';
import { DotEditPageToolbarComponent } from './dot-edit-page-toolbar.component';
import { DotEditPageToolbarModule } from './dot-edit-page-toolbar.module';
import { DotEditPageWorkflowsActionsModule } from '../dot-edit-page-workflows-actions/dot-edit-page-workflows-actions.module';
import { DebugElement, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as _ from 'lodash';
import { DotMessageService } from '@services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotGlobalMessageService } from '@components/_common/dot-global-message/dot-global-message.service';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotRenderedPageState } from '@portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { DotPageMode } from '@portlets/dot-edit-page/shared/models/dot-page-mode.enum';
import { mockUser } from '../../../../../test/login-service.mock';
import { DotWorkflowServiceMock } from '../../../../../test/dot-workflow-service.mock';
import { DotWorkflowService } from '@services/dot-workflow/dot-workflow.service';
import { mockDotPage, mockDotLayout } from '../../../../../test/dot-rendered-page.mock';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { of } from 'rxjs';

@Component({
    selector: 'dot-edit-page-workflows-actions',
    template: ''
})
class MockWorkflowActionsComponent {
    @Input()
    inode = '';
    @Input()
    label = 'Acciones';
}

@Component({
    selector: 'dot-test-host-component',
    template: `<dot-edit-page-toolbar [pageState]="pageState"></dot-edit-page-toolbar>`
})
class TestHostComponent {
    @Input()
    pageState: DotRenderedPageState;
}

describe('DotEditPageToolbarComponent', () => {
    let component: DotEditPageToolbarComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let dotLicenseService: DotLicenseService;

    const messageServiceMock = new MockDotMessageService({
        'dot.common.whats.changed': 'what',
        'dot.common.cancel': 'Cancel',
        'editpage.toolbar.edit.page': 'Edit',
        'editpage.toolbar.preview.page': 'Preview',
        'editpage.toolbar.live.page': 'Live'
    });

    let testbed;

    beforeEach(async(() => {
        testbed = DOTTestBed.configureTestingModule({
            declarations: [MockWorkflowActionsComponent, TestHostComponent],
            imports: [
                DotEditPageToolbarModule,
                DotEditPageWorkflowsActionsModule,
                RouterTestingModule.withRoutes([
                    {
                        component: DotEditPageToolbarComponent,
                        path: 'test'
                    }
                ]),
                BrowserAnimationsModule
            ],
            providers: [
                DotLicenseService,
                { provide: DotMessageService, useValue: messageServiceMock },
                DotGlobalMessageService,
                DotEventsService,
                {
                    provide: DotWorkflowService,
                    useClass: DotWorkflowServiceMock
                },
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ]
        });
    }));

    beforeEach(() => {
        fixture = testbed.createComponent(TestHostComponent);
        de = fixture.debugElement;
        component = de.query(By.css('dot-edit-page-toolbar')).componentInstance;
        fixture.componentInstance.pageState = new DotRenderedPageState(mockUser, {
            page: {
                ...mockDotPage,
                canEdit: true,
                canLock: true,
                languageId: 1,
                title: '',
                pageURI: '',
                shortyLive: '',
                shortyWorking: '',
                workingInode: '',
                lockedBy: null,
                rendered: ''
            },
            layout: mockDotLayout,
            canCreateTemplate: true,
            viewAs: {
                mode: DotPageMode[DotPageMode.EDIT]
            }
        });

        dotLicenseService = de.injector.get(DotLicenseService);
    });

    it('should have a toolbar element', () => {
        expect(de.query(By.css('p-toolbar'))).toBeTruthy();
    });


    describe('what\'s change event', () => {
        let whatsChanged: DebugElement;

        beforeEach(() => {
            spyOn(component.whatschange, 'emit');
            fixture.componentInstance.pageState.state.mode = DotPageMode.PREVIEW;
            spyOn(dotLicenseService, 'isEnterprise').and.returnValue(of(true));
            fixture.detectChanges();

            whatsChanged = de.query(By.css('p-checkbox'));
        });

        it('should have What is Changed selector', () => {
            const whatsChangedElem = de.query(By.css('p-checkbox'));
            expect(whatsChangedElem).toBeTruthy();
            expect(whatsChangedElem.componentInstance.label).toBe('what');
        });

        describe('events', () => {
            it('should emit what\'s change in true', () => {
                whatsChanged.triggerEventHandler('onChange', true);
                expect(component.whatschange.emit).toHaveBeenCalledTimes(1);
                expect(component.whatschange.emit).toHaveBeenCalledWith(true);
            });

            it('should emit what\'s change in false', () => {
                whatsChanged.triggerEventHandler('onChange', false);
                expect(component.whatschange.emit).toHaveBeenCalledTimes(1);
                expect(component.whatschange.emit).toHaveBeenCalledWith(false);
            });
        });
    });

});
