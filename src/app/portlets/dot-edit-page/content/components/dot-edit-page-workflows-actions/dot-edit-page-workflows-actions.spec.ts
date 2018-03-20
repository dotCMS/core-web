import { async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SplitButton } from 'primeng/primeng';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotWorkflowServiceMock } from '../../../../../test/dot-workflow-service.mock';
import { Observable } from 'rxjs/Observable';
import { DotWorkflowAction } from '../../../../../shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflowService } from '../../../../../api/services/dot-workflow/dot-workflow.service';
import { DotEditPageWorkflowsActionsComponent } from './dot-edit-page-workflows-actions.component';
import { CommonModule } from '@angular/common';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

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
                    }
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
        dotWorkflowService.getContentWorkflowActions(component.inode).subscribe(event => workflowsActions = event);
        spyOn(dotWorkflowService, 'fireWorkflowAction');

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
    });
});
