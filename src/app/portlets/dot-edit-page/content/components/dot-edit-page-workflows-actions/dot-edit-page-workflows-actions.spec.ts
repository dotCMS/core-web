import { CommonModule } from '@angular/common';
import { async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { SplitButton } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotWorkflowServiceMock } from '../../../../../test/dot-workflow-service.mock';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../../../test/login-service.mock';
import { DotWorkflowAction } from '../../../../../shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflowService } from '../../../../../api/services/dot-workflow/dot-workflow.service';
import { DotRouterService } from '../../../../../api/services/dot-router/dot-router.service';
import { DotHttpErrorManagerService } from '../../../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { DotEditPageWorkflowsActionsComponent } from './dot-edit-page-workflows-actions.component';
import { mockResponseView } from '../../../../../test/response-view.mock';

describe('DotEditPageWorkflowsActionsComponent', () => {
    let component: DotEditPageWorkflowsActionsComponent;
    let fixture: ComponentFixture<DotEditPageWorkflowsActionsComponent>;
    let de: DebugElement;
    let testbed;

    beforeEach(
        async(() => {
            testbed = DOTTestBed.configureTestingModule({
                imports: [RouterTestingModule, BrowserAnimationsModule],
                declarations: [DotEditPageWorkflowsActionsComponent],
                providers: [
                    {
                        provide: DotWorkflowService,
                        useClass: DotWorkflowServiceMock
                    },
                    { provide: LoginService, useClass: LoginServiceMock },
                    DotHttpErrorManagerService,
                    DotRouterService
                ]
            });
        })
    );

    beforeEach(() => {
        fixture = testbed.createComponent(DotEditPageWorkflowsActionsComponent);
        component = fixture.componentInstance;
        component.label = 'ACTIONS';
        component.inode = 'cc2cdf9c-a20d-4862-9454-2a76c1132123';
        de = fixture.debugElement;
    });

    it('should have a workflow actions element', () => {
        expect(de.query(By.css('.edit-page-toolbar__actions'))).toBeTruthy();
    });

    it('should have a workflow actions with label "ACTIONS"', () => {
        const btnLabel: HTMLElement = de.query(By.css('.edit-page-toolbar__actions')).nativeElement;
        fixture.detectChanges();
        expect(btnLabel.textContent).toContain('ACTIONS');
    });

    it('should set action split buttons params', () => {
        fixture.detectChanges();
        const actionsButton: SplitButton = de.query(By.css('.edit-page-toolbar__actions')).componentInstance;
        expect(actionsButton.model[0].label).toEqual('Assign Workflow');
        expect(actionsButton.model[1].label).toEqual('Save');
        expect(actionsButton.model[2].label).toEqual('Save / Publish');
    });

    it('should trigger the methods in the action buttons', () => {
        const dotWorkflowService: DotWorkflowService = de.injector.get(DotWorkflowService);
        let workflowsActions: DotWorkflowAction[];
        dotWorkflowService.getContentWorkflowActions(component.inode).subscribe((event) => (workflowsActions = event));
        spyOn(dotWorkflowService, 'fireWorkflowAction').and.callThrough();
        spyOn(dotWorkflowService, 'getContentWorkflowActions').and.callThrough();

        fixture.detectChanges();

        const splitButtons = de.query(By.all()).nativeElement.querySelectorAll('.ui-menuitem-link');
        const firstButton = splitButtons[0];
        const secondButton = splitButtons[1];
        const thirdButton = splitButtons[2];

        firstButton.click();
        expect(dotWorkflowService.fireWorkflowAction).toHaveBeenCalledWith(component.inode, workflowsActions[0].id);

        secondButton.click();
        expect(dotWorkflowService.fireWorkflowAction).toHaveBeenCalledWith(component.inode, workflowsActions[1].id);

        thirdButton.click();
        expect(dotWorkflowService.fireWorkflowAction).toHaveBeenCalledWith(component.inode, workflowsActions[2].id);

        expect(dotWorkflowService.fireWorkflowAction).toHaveBeenCalledTimes(3);

        fixture.detectChanges();

        expect(dotWorkflowService.getContentWorkflowActions).toHaveBeenCalledTimes(2);

    });

});
