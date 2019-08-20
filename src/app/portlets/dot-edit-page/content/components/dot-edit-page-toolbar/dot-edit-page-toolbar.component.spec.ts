import { async, ComponentFixture } from '@angular/core/testing';
import { DebugElement, Component, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CheckboxModule, ToolbarModule, ButtonModule } from 'primeng/primeng';

import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DOTTestBed } from '@tests/dot-test-bed';
import { mockDotRenderedPageState } from '@tests/dot-rendered-page-state.mock';
import { DotPageStateService } from '../../services/dot-page-state/dot-page-state.service';

import { DotEditPageToolbarComponent } from './dot-edit-page-toolbar.component';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { DotMessageService } from '@services/dot-messages-service';
import { DotRenderedPageState } from '@portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { CommonModule } from '@angular/common';
import { DotEditToolbarModule } from '@portlets/dot-edit-page/main/dot-edit-toolbar/dot-edit-toolbar.module';
import { FormsModule } from '@angular/forms';
import { DotPage, DotPageMode } from '@portlets/dot-edit-page/shared/models';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'dot-test-host-component',
    template: `
        <dot-edit-page-toolbar [pageState]="pageState"></dot-edit-page-toolbar>
    `
})
class TestHostComponent {
    @Input() pageState: DotRenderedPageState = mockDotRenderedPageState;
}

@Injectable()
class MockDotLicenseService {
    isEnterprise(): Observable<boolean> {
        return of(true);
    }
}

@Component({
    selector: 'dot-global-message',
    template: ''
})
class MockGlobalMessageComponent {}

@Component({
    selector: 'dot-edit-page-state-controller',
    template: ''
})
class MockDotEditPageStateControllerComponent {
    @Input() pageState: DotRenderedPageState;
}

@Component({
    selector: 'dot-edit-page-workflows-actions',
    template: ''
})
class MockDotEditPageWorkflowActionComponent {
    @Input() page: DotPage;
    @Output() fired = new EventEmitter<Boolean>();
}

@Component({
    selector: 'dot-edit-page-view-as-controller',
    template: ''
})
class MockDotEditPageViewAsControllerComponent {
    @Input() pageState: DotRenderedPageState;
}

@Component({
    selector: 'dot-edit-page-info',
    template: ''
})
class MockDotEditPageInfoComponent {
    @Input() pageState: DotRenderedPageState;
}

describe('DotEditPageToolbarComponent', () => {
    let fixtureHost: ComponentFixture<TestHostComponent>;
    let componentHost: TestHostComponent;
    let component: DotEditPageToolbarComponent;
    let de: DebugElement;
    let deHost: DebugElement;
    let dotLicenseService: DotLicenseService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                DotEditPageToolbarComponent,
                MockGlobalMessageComponent,
                MockDotEditPageInfoComponent,
                MockDotEditPageWorkflowActionComponent,
                MockDotEditPageStateControllerComponent,
                MockDotEditPageViewAsControllerComponent
            ],
            imports: [
                ButtonModule,
                CommonModule,
                CheckboxModule,
                DotEditToolbarModule,
                FormsModule,
                ToolbarModule
            ],
            providers: [
                { provide: DotLicenseService, useClass: MockDotLicenseService },
                {
                    provide: DotMessageService,
                    useValue: new MockDotMessageService({
                        'dot.common.whats.changed': 'Whats',
                        'dot.common.cancel': 'Cancel'
                    })
                },
                {
                    provide: DotPageStateService,
                    useValue: {}
                }
            ]
        });
    }));

    beforeEach(() => {
        fixtureHost = DOTTestBed.createComponent(TestHostComponent);
        deHost = fixtureHost.debugElement;
        componentHost = fixtureHost.componentInstance;

        de = deHost.query(By.css('dot-edit-page-toolbar'));
        component = de.componentInstance;

        dotLicenseService = de.injector.get(DotLicenseService);
    });

    describe('elements', () => {
        beforeEach(() => {
            fixtureHost.detectChanges();
        });

        it('should have elements placed correctly', () => {
            const editToolbar = de.query(By.css('dot-edit-toolbar'));
            const editPageInfo = de.query(
                By.css('dot-edit-toolbar .main-toolbar-left dot-edit-page-info')
            );
            const globalMessage = de.query(
                By.css('dot-edit-toolbar .main-toolbar-right dot-global-message')
            );
            const editCancelBtn = de.query(
                By.css('dot-edit-toolbar .main-toolbar-right .edit-page-toolbar__cancel')
            );
            const editWorkflowActions = de.query(
                By.css('dot-edit-toolbar .main-toolbar-right dot-edit-page-workflows-actions')
            );
            const editStateController = de.query(
                By.css('dot-edit-toolbar .secondary-toolbar-left dot-edit-page-state-controller')
            );
            const whatsChangedCheck = de.query(
                By.css('dot-edit-toolbar .secondary-toolbar-left .dot-edit__what-changed-button')
            );
            const editPageViewAs = de.query(
                By.css('dot-edit-toolbar .secondary-toolbar-right dot-edit-page-view-as-controller')
            );
            expect(editToolbar).toBeDefined();
            expect(editPageInfo).toBeDefined();
            expect(globalMessage).toBeDefined();
            expect(editCancelBtn).toBeDefined();
            expect(editWorkflowActions).toBeDefined();
            expect(editStateController).toBeDefined();
            expect(whatsChangedCheck).toBeDefined();
            expect(editPageViewAs).toBeDefined();
        });
    });

    describe('dot-edit-page-info', () => {
        it('should have pageState attr', () => {
            fixtureHost.detectChanges();
            const dotEditPageInfo = de.query(By.css('dot-edit-page-info'));
            expect(dotEditPageInfo.componentInstance.pageState).toBe(mockDotRenderedPageState);
        });
    });

    describe('edit-page-toolbar-cancel', () => {
        it('should have right attr', () => {
            fixtureHost.detectChanges();
            const editPageCancelBtn = de.query(By.css('.edit-page-toolbar__cancel'));
            expect(editPageCancelBtn.attributes.class).toBe('edit-page-toolbar__cancel');
            expect(editPageCancelBtn.attributes.secondary).toBeDefined();
            expect(editPageCancelBtn.attributes.tiny).toBeDefined();
            expect(editPageCancelBtn.nativeElement.innerText).toBe('CANCEL');
        });

        it('should emit on click', () => {
            spyOn(component.cancel, 'emit');
            fixtureHost.detectChanges();
            const editPageCancelBtn = de.query(By.css('.edit-page-toolbar__cancel'));
            editPageCancelBtn.triggerEventHandler('click', {});
            expect(component.cancel.emit).toHaveBeenCalled();
        });
    });

    describe('dot-edit-page-workflows-actions', () => {
        it('should have pageState attr', () => {
            fixtureHost.detectChanges();
            const dotEditWorkflowActions = de.query(By.css('dot-edit-page-workflows-actions'));
            expect(dotEditWorkflowActions.componentInstance.page).toBe(mockDotRenderedPageState.page);
        });

        it('should emit on click', () => {
            spyOn(component.actionFired, 'emit');
            fixtureHost.detectChanges();
            const dotEditWorkflowActions = de.query(By.css('dot-edit-page-workflows-actions'));
            dotEditWorkflowActions.triggerEventHandler('fired', {});
            expect(component.actionFired.emit).toHaveBeenCalled();
        });
    });

    describe('dot-edit-page-state-controller', () => {
        it('should have pageState attr', () => {
            fixtureHost.detectChanges();
            const dotEditPageState = de.query(By.css('dot-edit-page-state-controller'));
            expect(dotEditPageState.componentInstance.pageState).toBe(mockDotRenderedPageState);
        });
    });

    describe('dot-edit-page-view-as-controller', () => {
        it('should have pageState attr', () => {
            fixtureHost.detectChanges();
            const dotEditPageViewAs = de.query(By.css('dot-edit-page-view-as-controller'));
            expect(dotEditPageViewAs.componentInstance.pageState).toBe(mockDotRenderedPageState);
        });
    });

    describe('what\'s change', () => {
        describe('no license', () => {
            beforeEach(() => {
                spyOn(dotLicenseService, 'isEnterprise').and.returnValue(of(false));
                fixtureHost.detectChanges();
            });

            it('should not show', () => {
                const whatsChangedElem = de.query(By.css('.dot-edit__what-changed-button'));
                expect(whatsChangedElem).toBeNull();
            });
        });

        describe('with license', () => {
            beforeEach(() => {
                spyOn(component.whatschange, 'emit');
            });

            it('should hide what\'s change selector', () => {
                componentHost.pageState.state.mode = DotPageMode.EDIT;
                fixtureHost.detectChanges();

                const whatsChangedElem = de.query(By.css('p-checkbox'));
                expect(whatsChangedElem).toBeNull();
            });

            it('should have what\'s change selector', () => {
                componentHost.pageState.state.mode = DotPageMode.PREVIEW;
                fixtureHost.detectChanges();

                const whatsChangedElem = de.query(By.css('p-checkbox'));
                expect(whatsChangedElem).toBeDefined();
                expect(whatsChangedElem.componentInstance.label).toBe('Whats');
            });

            describe('events', () => {
                let whatsChangedElem: DebugElement;

                beforeEach(() => {
                    componentHost.pageState.state.mode = DotPageMode.PREVIEW;
                    fixtureHost.detectChanges();
                    whatsChangedElem = de.query(By.css('p-checkbox'));
                });

                it('should emit what\'s change in true', () => {
                    whatsChangedElem.triggerEventHandler('onChange', true);
                    expect(component.whatschange.emit).toHaveBeenCalledTimes(1);
                    expect(component.whatschange.emit).toHaveBeenCalledWith(true);
                });

                it('should emit what\'s change in false', () => {
                    whatsChangedElem.triggerEventHandler('onChange', false);
                    expect(component.whatschange.emit).toHaveBeenCalledTimes(1);
                    expect(component.whatschange.emit).toHaveBeenCalledWith(false);
                });
            });
        });
    });
});
