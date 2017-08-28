
import { RegexCheckPropertyComponent } from './index';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Component, Input } from '@angular/core';
import { MockMessageService } from '../../../../../../test/message-service.mock';
import { DOTTestBed } from '../../../../../../test/dot-test-bed';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FormGroup, FormControl, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('RegexCheckPropertyComponent', () => {
    let comp: RegexCheckPropertyComponent;
    let fixture: ComponentFixture<RegexCheckPropertyComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const messageServiceMock = new MockMessageService({
        'Validation-RegEx': 'Validation-RegEx'
    });

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                RegexCheckPropertyComponent
            ],
            imports: [
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock },
            ]
        });

        fixture = DOTTestBed.createComponent(RegexCheckPropertyComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        comp.group = new FormGroup({
            regexCheck: new FormControl('')
        });
        comp.property = {
            name: 'regexCheck',
            value: 'value',
            field: {}
        };
    }));

    it('should have a form', () => {
        const group = new FormGroup({});
        comp.group = group;
        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));

        expect(divForm).not.toBeNull();
        expect(group).toEqual(divForm.componentInstance.group);
    });

    it('should have a input', () => {
        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pInput: DebugElement = fixture.debugElement.query(By.css('input[type="text"]'));

        expect(pInput).not.toBeNull();
    });

    it('should have a dropDown', () => {
        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pDropDown: DebugElement = fixture.debugElement.query(By.css('p-dropdown'));

        expect(pDropDown).not.toBeNull();
        expect(comp.REGEX_CHECK_TEMPLATE).toBe(pDropDown.componentInstance.options);
    });

    it('should change the input value', () => {
        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pDropDown: DebugElement = fixture.debugElement.query(By.css('p-dropdown'));
        pDropDown.triggerEventHandler('onChange', {
            value: comp.REGEX_CHECK_TEMPLATE[1].value
        });

        fixture.detectChanges();

        const pInput: DebugElement = fixture.debugElement.query(By.css('input[type="text"]'));
        expect(comp.REGEX_CHECK_TEMPLATE[1].value).toBe(comp.group.get('regexCheck').value);
    });
});
