import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotAddPersonaDialogComponent } from './dot-add-persona-dialog.component';
import { MockDotMessageService } from '@tests/dot-message-service.mock';

import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMessageService } from '@services/dot-messages-service';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';
import { Component, DebugElement, EventEmitter, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { LoginService } from 'dotcms-js';
import { LoginServiceMock } from '@tests/login-service.mock';
import { mockDotPersona } from '@tests/dot-persona.mock';
import { of as observableOf } from 'rxjs';

@Component({
    selector: 'dot-create-persona-form',
    template: ''
})
class MockDotCreatePersonaFormComponent {
    @Output() isValid = new EventEmitter<boolean>();
    resetForm = jasmine.createSpy('resetForm');
    form = {
        valid: true,
        getRawValue: () => {
            return {
                test: 'test'
            };
        }
    };
}

fdescribe('DotAddPersonaDialogComponent', () => {
    let component: DotAddPersonaDialogComponent;
    let fixture: ComponentFixture<DotAddPersonaDialogComponent>;
    let dotDialog: DebugElement;
    const messageServiceMock = new MockDotMessageService({
        'modes.persona.add.persona': 'Add Persona',
        'dot.common.dialog.accept': 'Accept',
        'dot.common.dialog.reject': 'Cancel'
    });

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotAddPersonaDialogComponent, MockDotCreatePersonaFormComponent],
            imports: [BrowserAnimationsModule, DotDialogModule],
            providers: [
                DotWorkflowActionsFireService,
                DotHttpErrorManagerService,
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: LoginService, useClass: LoginServiceMock }
            ]
        });

        fixture = TestBed.createComponent(DotAddPersonaDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dotDialog = fixture.debugElement.query(By.css('dot-dialog'));
    });

    it('should not be visible by default', () => {
        expect(dotDialog).toBeNull();
    });

    describe('visible Dialog', () => {
        beforeEach(() => {
            component.visible = true;
            fixture.detectChanges();
            dotDialog = fixture.debugElement.query(By.css('dot-dialog'));
        });

        it('should set dialog attributes correctly', () => {
            expect(dotDialog.componentInstance.header).toEqual('Add Persona');
            expect(dotDialog.componentInstance.actions).toEqual({
                accept: {
                    label: 'Accept',
                    disabled: true,
                    action: jasmine.any(Function)
                },
                cancel: {
                    label: 'Cancel',
                    action: jasmine.any(Function)
                }
            });
        });

        it('should handle disable state of the accept button when form value change', () => {
            spyOn(component, 'handlerFormValidState');
            component.personaForm.isValid.emit(true);

            expect(component.handlerFormValidState).toHaveBeenCalledWith(true);
        });

        it('should reset persona form, disable accept button and set visible to false on closeDialog', () => {
            component.closeDialog();

            expect(component.personaForm.resetForm).toHaveBeenCalled();
            expect(component.visible).toBe(false);
            expect(component.dialogActions.accept.disabled).toBe(true);
        });

        it('should call closeDialog on dotDialog hide', () => {
            spyOn(component, 'closeDialog');
            dotDialog.componentInstance.hide.emit();
            expect(component.closeDialog).toHaveBeenCalled();
        });

        it('should emit the new persona and close dialog if form is valid', () => {
            spyOn(component, 'closeDialog');
            spyOn(component.createdPersona, 'emit');
            spyOn(component.dotWorkflowActionsFireService, 'new').and.returnValue(
                observableOf(mockDotPersona)
            );

            component.savePersona();
            expect(component.createdPersona.emit).toHaveBeenCalledWith(mockDotPersona);
            expect(component.closeDialog).toHaveBeenCalled();
        });

        xit('should call dotHttpErrorManagerService if endpoint fails', () => {
            expect(component).toBeTruthy();
        });


    });
});
