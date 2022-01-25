import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    DotContentCompareComponent,
    DotContentCompareEvent
} from './dot-content-compare.component';
import { DotContentCompareStore } from '@components/dot-content-compare/store/dot-content-compare.store';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs';
import { dotContentCompareTableDataMock } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component.spec';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-message/dot-messages.service';

import { DotContentCompareModule } from '@components/dot-content-compare/dot-content-compare.module';
import { DotContentCompareTableComponent } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component';
import { By } from '@angular/platform-browser';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { ConfirmationService } from 'primeng/api';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { DotVersionableService } from '@services/dot-verionable/dot-versionable.service';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';

const DotContentCompareEventMOCK = {
    inode: '1',
    identifier: '2',
    language: 'es'
};

const storeMock = jasmine.createSpyObj(
    'DotContentCompareStore',
    ['loadData', 'updateShowDiff', 'updateCompare', 'bringBack'],
    {
        vm$: of({ data: dotContentCompareTableDataMock, showDiff: false })
    }
);

@Component({
    selector: 'dot-test-host-component',
    template:
        '<dot-content-compare [data]="data"  (close)="close.emit(true)" ></dot-content-compare>'
})
class TestHostComponent {
    @Input() data: DotContentCompareEvent;
    @Output() close = new EventEmitter<boolean>();
}

describe('DotContentCompareComponent', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let dotContentCompareStore: DotContentCompareStore;
    let contentCompareTableComponent: DotContentCompareTableComponent;
    let dotAlertConfirmService: DotAlertConfirmService;
    let confirmationService: ConfirmationService;
    let dotRouterService: DotRouterService;

    const messageServiceMock = new MockDotMessageService({
        Confirm: 'Confirm',
        'folder.replace.contentlet.working.version':
            'Are you sure you would like to replace your working version with this contentlet version?'
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DotContentCompareComponent, TestHostComponent],
            imports: [DotContentCompareModule],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: DotRouterService, useClass: MockDotRouterService },
                DotAlertConfirmService,
                ConfirmationService,
                {
                    provide: DotVersionableService,
                    useValue: {
                        bringBack: jasmine.createSpy().and.returnValue(of({ inode: '123' }))
                    }
                },
                {
                    provide: DotHttpErrorManagerService,
                    useValue: {
                        handle: jasmine.createSpy().and.returnValue(
                            of({
                                status: {
                                    toString: () => ''
                                }
                            })
                        )
                    }
                }
            ]
        });
        TestBed.overrideProvider(DotContentCompareStore, { useValue: storeMock });

        hostFixture = TestBed.createComponent(TestHostComponent);
        de = hostFixture.debugElement;

        dotContentCompareStore = TestBed.inject(DotContentCompareStore);
        dotAlertConfirmService = TestBed.inject(DotAlertConfirmService);
        confirmationService = TestBed.inject(ConfirmationService);
        dotRouterService = TestBed.inject(DotRouterService);

        hostComponent = hostFixture.componentInstance;
        hostComponent.data = DotContentCompareEventMOCK;
        hostFixture.detectChanges();
        contentCompareTableComponent = de.query(By.css('dot-content-compare-table'))
            .componentInstance;
    });

    it('should pass data correctly', () => {
        expect(dotContentCompareStore.loadData).toHaveBeenCalledWith(DotContentCompareEventMOCK);
        expect(contentCompareTableComponent.data).toEqual(dotContentCompareTableDataMock);
        expect(contentCompareTableComponent.showDiff).toEqual(false);
    });

    it('should update diff flag', () => {
        contentCompareTableComponent.changeDiff.emit(true);
        expect(dotContentCompareStore.updateShowDiff).toHaveBeenCalledOnceWith(true);
    });

    it('should update compare content', () => {
        contentCompareTableComponent.changeVersion.emit(('value' as unknown) as DotCMSContentlet);
        expect(dotContentCompareStore.updateCompare).toHaveBeenCalledOnceWith(
            ('value' as unknown) as DotCMSContentlet
        );
    });

    it('should bring back version after confirm and emit close', () => {
        spyOn(dotAlertConfirmService, 'confirm').and.callFake((conf) => {
            conf.accept();
        });
        spyOn(hostComponent.close, 'emit');

        contentCompareTableComponent.bringBack.emit('123');

        expect<any>(dotAlertConfirmService.confirm).toHaveBeenCalledWith({
            accept: jasmine.any(Function),
            reject: jasmine.any(Function),
            header: 'Confirm',
            message:
                'Are you sure you would like to replace your working version with this contentlet version?'
        });

        expect(dotRouterService.goToURL).toHaveBeenCalledOnceWith('/c/content/123');
        expect(hostComponent.close.emit).toHaveBeenCalledOnceWith(true);
    });
});
