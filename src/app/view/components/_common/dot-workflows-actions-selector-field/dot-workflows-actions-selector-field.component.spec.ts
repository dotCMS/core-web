import { async, ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '@tests/dot-test-bed';
import { of } from 'rxjs';
import { DebugElement, Component } from '@angular/core';

import { DotWorkflowsActionsSelectorFieldComponent } from './dot-workflows-actions-selector-field.component';
import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { DropdownModule, Dropdown } from 'primeng/primeng';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-workflows-actions-selector-field
                formControlName="action"
                [workflows]="['000', '123', '456']"
            ></dot-workflows-actions-selector-field>
            {{ form.value | json }}
        </form>
    `
})
class FakeFormComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        /*
            This should go in the ngOnInit but I don't want to detectChanges everytime for
            this fake test component
        */
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

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [FakeFormComponent, DotWorkflowsActionsSelectorFieldComponent],
            imports: [DropdownModule],
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
                        }
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixtureHost = DOTTestBed.createComponent(FakeFormComponent);
        deHost = fixtureHost.debugElement;
        componentHost = deHost.componentInstance;
        de = deHost.query(By.css('dot-workflows-actions-selector-field'));
        component = de.componentInstance;
        fixtureHost.detectChanges();
        dropdownDe = de.query(By.css('p-dropdown'));
        dropdown = dropdownDe.componentInstance;
    });

    describe('p-dropdown', () => {
        it('should be defined', () => {
            expect(dropdownDe).toBeDefined();
        });

        it('should have attr', () => {
            expect(dropdown.appendTo).toBe('body');
            expect(dropdown.disabled).toBe(false);
            expect(dropdown.filter).toBe(true);
            expect(dropdown.placeholder).toBe('Select an action');
        });

        it('should have width 100%', () => {
            expect(dropdown.style).toEqual({ width: '100%' });
        });
    });

    describe('ControlValueAccessor', () => {
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
            fixtureHost.componentInstance.form.get('action').disable();
            fixtureHost.detectChanges();
            expect(dropdown.disabled).toBe(true);
        });
    });
});
