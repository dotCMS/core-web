import { async, ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '@tests/dot-test-bed';
import { of } from 'rxjs';
import { DebugElement, Component, OnInit } from '@angular/core';

import { DotWorkflowsActionsSelectorFieldComponent } from './dot-workflows-actions-selector-field.component';
import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/primeng';

@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-workflows-actions-selector-field
                formControlName="action"
                [workflows]="workfows"
            ></dot-workflows-actions-selector-field>
            {{ form.value | json }}
        </form>
    `
})
class FakeFormComponent implements OnInit {
    form: FormGroup;
    workfows: string[] = [];

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            action: [{ value: '456', disabled: false }]
        });
    }
}

const messageServiceMock = new MockDotMessageService({
    'contenttypes.selector.workflow.action': 'Select an action'
});

describe('DotWorkflowsActionsSelectorFieldComponent', () => {
    let fixtureHost: ComponentFixture<FakeFormComponent>;
    let deHost: DebugElement;
    let componentHost: FakeFormComponent;
    let component: DotWorkflowsActionsSelectorFieldComponent;
    let de: DebugElement;
    let dropdownDe: DebugElement;
    let dropdown: Dropdown;
    let dotWorkflowsActionsService: DotWorkflowsActionsService;
    let getSpy: jasmine.Spy;
    let loadSpy: jasmine.Spy;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotWorkflowsActionsSelectorFieldComponent, FakeFormComponent],
            providers: [
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                {
                    provide: DotWorkflowsActionsService,
                    useValue: {
                        get() {
                            return of([]);
                        },
                        load() {}
                    }
                }
            ],
            imports: [DropdownModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixtureHost = DOTTestBed.createComponent(FakeFormComponent);
        deHost = fixtureHost.debugElement;
        componentHost = deHost.componentInstance;
        de = deHost.query(By.css('dot-workflows-actions-selector-field'));
        component = de.componentInstance;
        dotWorkflowsActionsService = deHost.injector.get(DotWorkflowsActionsService);
        getSpy = spyOn(dotWorkflowsActionsService, 'get').and.callThrough();
        loadSpy = spyOn(dotWorkflowsActionsService, 'load');
    });

    describe('initialization', () => {
        beforeEach(() => {
            fixtureHost.detectChanges();
        });

        it('should load actions', () => {
            expect(dotWorkflowsActionsService.load).toHaveBeenCalledTimes(1);
            expect(dotWorkflowsActionsService.load).toHaveBeenCalledWith([]);
        });

        it('should subscribe to actions', () => {
            expect(dotWorkflowsActionsService.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('p-dropdown', () => {
        describe('basic', () => {
            beforeEach(() => {
                fixtureHost.detectChanges();
                dropdown = de.query(By.css('p-dropdown')).componentInstance;
            });

            it('should be defined', () => {
                expect(dropdown).toBeDefined();
            });

            it('should have attr', () => {
                expect(dropdown.appendTo).toBe('body');
                expect(dropdown.filter).toBe(true);
                expect(dropdown.placeholder).toBe('Select an action');
            });

            it('should have width 100%', () => {
                expect(dropdown.style).toEqual({ width: '100%' });
            });
        });

        describe('disable attr', () => {
            it('should be disable when actions list is empty', () => {
                fixtureHost.detectChanges();
                dropdown = de.query(By.css('p-dropdown')).componentInstance;
                expect(dropdown.disabled).toBe(true);
            });

            it('should be enaled when actions list is filled', () => {
                getSpy.and.returnValue(
                    of([
                        {
                            name: 'Hello',
                            id: '123'
                        },
                        {
                            name: 'World',
                            id: '456'
                        }
                    ])
                );
                fixtureHost.detectChanges();
                dropdown = de.query(By.css('p-dropdown')).componentInstance;
                expect(dropdown.disabled).toBe(false);
            });
        });
    });

    describe('ControlValueAccessor', () => {
        beforeEach(() => {
            fixtureHost.detectChanges();
            dropdownDe = de.query(By.css('p-dropdown'));
            dropdown = dropdownDe.componentInstance;
        });

        it('should set value', () => {
            expect(component.value).toBe('456');
        });

        it('should propagate changes', () => {
            dropdownDe.triggerEventHandler('onChange', {
                originalEvent: {},
                value: '123'
            });

            expect(componentHost.form.value).toEqual({
                action: '123'
            });
        });

        it('should set disabled', () => {
            componentHost.form.get('action').disable();
            fixtureHost.detectChanges();
            expect(dropdown.disabled).toBe(true);
        });
    });

    describe('@Inputs', () => {
        describe('workflows', () => {
            it('should reload actions', () => {
                componentHost.workfows = ['123', '456'];
                fixtureHost.detectChanges();
                expect(dotWorkflowsActionsService.load).toHaveBeenCalledWith(['123', '456']);
            });
        });
    });
});
