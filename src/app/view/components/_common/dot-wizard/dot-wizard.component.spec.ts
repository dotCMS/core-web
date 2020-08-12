import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { DotWizardComponent } from './dot-wizard.component';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotWizardService } from '@services/dot-wizard/dot-wizard.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotPushPublishDialogData } from 'dotcms-models';
import { DotPushPublishData } from '@models/dot-push-publish-data/dot-push-publish-data';
import { DotWizardStep } from '@models/dot-wizard-step/dot-wizard-step.model';
import { CommonModule } from '@angular/common';
import { DotContainerReferenceModule } from '@directives/dot-container-reference/dot-container-reference.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const messageServiceMock = new MockDotMessageService({
    send: 'Send',
    next: 'Next',
    previous: 'Previous'
});

@Component({
    selector: 'dot-form-one',
    template: '<span>name: </span><input/><br><span>last Name:</span><input/>'
})
class FormOneComponent {
    @Input() data: DotPushPublishDialogData;
    @Output() value = new EventEmitter<DotPushPublishData>();
    @Output() valid = new EventEmitter<boolean>();
}

@Component({
    selector: 'dot-form-two',
    template: ''
})
class FormTwoComponent {
    @Input() data: DotPushPublishDialogData;
    @Output() value = new EventEmitter<DotPushPublishData>();
    @Output() valid = new EventEmitter<boolean>();
}

const steps: DotWizardStep<any>[] = [
    { component: FormOneComponent, data: { id: 'numberOne' } },
    { component: FormTwoComponent, data: { id: 'numberTwo' } }
];

fdescribe('DotWizardComponent', () => {
    let component: DotWizardComponent;
    let fixture: ComponentFixture<DotWizardComponent>;
    let dotWizardService: DotWizardService;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [DotWizardComponent, FormOneComponent, FormTwoComponent],
                imports: [DotDialogModule, CommonModule, DotContainerReferenceModule],
                providers: [
                    { provide: DotMessageService, useValue: messageServiceMock },
                    DotWizardService
                ]
            }).compileComponents();

            TestBed.overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [FormOneComponent, FormTwoComponent]
                }
            });
            TestBed.compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotWizardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dotWizardService = fixture.debugElement.injector.get(DotWizardService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should load steps', () => {
        dotWizardService.open(steps);
        fixture.detectChanges();

        fixture.detectChanges();

        expect(component).toBeTruthy();
    });


    // it('should load steps', fakeAsync(() => {
    //     dotWizardService.open(steps);
    //     fixture.detectChanges();
    //     tick(1);
    //     fixture.detectChanges();
    //
    //     expect(component).toBeTruthy();
    // }));
});
