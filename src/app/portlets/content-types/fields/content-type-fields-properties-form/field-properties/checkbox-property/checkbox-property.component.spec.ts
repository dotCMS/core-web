import { CheckboxPropertyComponent } from './';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { async } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../../test/dot-test-bed';
import { MessageService } from '../../../../../../api/services/messages-service';
import { By } from '@angular/platform-browser';
import { MockMessageService } from '../../../../../../test/message-service.mock';
import { FieldProperty } from '../field-properties.model';
import { FormGroup, FormControl } from '@angular/forms';

describe('CheckboxPropertyComponent', () => {
    let comp: CheckboxPropertyComponent;
    let fixture: ComponentFixture<CheckboxPropertyComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const messageServiceMock = new MockMessageService({
        'contenttypes.field.properties.required.label': 'required',
        'contenttypes.field.properties.user_searchable.label': 'user_searchable.',
        'contenttypes.field.properties.system_indexed.label': 'system_indexed',
        'contenttypes.field.properties.listed.label': 'listed',
        'contenttypes.field.properties.unique.label': 'unique'
    });

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                CheckboxPropertyComponent
            ],
            imports: [
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock },
            ]
        });

        fixture = DOTTestBed.createComponent(CheckboxPropertyComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    }));

    it('should have a form', () => {
        const group = new FormGroup({});
        comp.group = group;
        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));

        expect(divForm).not.toBeNull();
        expect(group).toEqual(divForm.componentInstance.group);
    });

    it('should have a p-checkbox', () => {
        comp.group = new FormGroup({
            name: new FormControl('')
        });
        comp.property = {
            name: 'name',
            value: 'value',
            field: {}
        };

        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pCheckbox: DebugElement = fixture.debugElement.query(By.css('p-checkbox'));

        expect(pCheckbox).not.toBeNull();
        expect('Name').toBe(pCheckbox.componentInstance.label);
        expect('value').toBe(pCheckbox.componentInstance.value);
    });
});
