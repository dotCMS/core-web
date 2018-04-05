import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { async } from '@angular/core/testing';

import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotWorkflowsSelectorFieldComponent } from './dot-workflows-selector-field.component';
import { DotWorkflowServiceMock, mockWorkflows } from './../../../../test/dot-workflow-service.mock';
import { DotWorkflowService } from './../../../../api/services/dot-workflow/dot-workflow.service';
import { MultiSelect } from 'primeng/primeng';
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

const messageServiceMock = new MockDotMessageService({
    'dot.common.select.workflows': 'Pick it up',
    'dot.common.archived': 'Archivado'
});

fdescribe('DotWorkflowsSelectorFieldComponent', () => {
    let component: DotWorkflowsSelectorFieldComponent;
    let fixture: ComponentFixture<DotWorkflowsSelectorFieldComponent>;
    let de: DebugElement;
    let dotWorkflowService: DotWorkflowService;
    let multiselect: MultiSelect;

    describe('basic ui', () => {
        beforeEach(
            async(() => {
                DOTTestBed.configureTestingModule({
                    declarations: [DotWorkflowsSelectorFieldComponent],
                    providers: [
                        {
                            provide: DotWorkflowService,
                            useClass: DotWorkflowServiceMock
                        },
                        {
                            provide: DotMessageService,
                            useValue: messageServiceMock
                        }
                    ],
                    imports: []
                });

                fixture = DOTTestBed.createComponent(DotWorkflowsSelectorFieldComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                dotWorkflowService = de.injector.get(DotWorkflowService);
                spyOn(dotWorkflowService, 'get').and.callThrough();
                fixture.detectChanges();

                multiselect = de.query(By.css('p-multiSelect')).componentInstance;
            })
        );

        it('should have have a multiselect', () => {
            expect(multiselect).not.toBe(null);
        });

        it('should have maxSelectedLabels set correctly', () => {
            expect(multiselect.maxSelectedLabels).toBe(1);
        });

        it('should have default label', () => {
            expect(multiselect.defaultLabel).toEqual('Pick it up');
        });

        it('should get workflow list from server', () => {
            expect(dotWorkflowService.get).toHaveBeenCalledTimes(1);
        });

        it('should fill the workflows options', () => {
            const itemsLabels = de.queryAll(By.css('.ui-multiselect-items .workflow__label')).map((item) => item.nativeElement.innerText);
            expect(itemsLabels).toEqual(mockWorkflows.map((workflow) => workflow.name));
        });

        it('should have archived item', () => {
            const archivedItems = de.queryAll(By.css('.workflow-archive__label'));
            expect(archivedItems.length).toBe(1);
            expect(archivedItems[0].nativeElement.innerText).toBe(mockWorkflows[1].name);
        });

        fit('should have archived message', () => {
            const archivedMessage = de.queryAll(By.css('.workflow__archive-message'));
            expect(archivedMessage.length).toBe(1);
            expect(archivedMessage[0].nativeElement.innerText).toBe('(Archivado)');
        });
    });

    describe('value accessor', () => {});
});
