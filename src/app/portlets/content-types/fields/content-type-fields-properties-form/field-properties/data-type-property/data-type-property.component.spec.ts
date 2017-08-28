
import { DataTypePropertyComponent } from './';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MockMessageService } from '../../../../../../test/message-service.mock';
import { async } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../../test/dot-test-bed';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('DataTypePropertyComponent', () => {
    let comp: DataTypePropertyComponent;
    let fixture: ComponentFixture<DataTypePropertyComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const messageServiceMock = new MockMessageService({
        'Data-Type': 'Data-Type',
        'Binary': 'Binary',
        'Text': 'Text',
        'True-False': 'True-False',
        'Date': 'Date',
        'Decimal': 'Decimal',
        'Whole-Number': 'Whole-Number',
        'Large-Block-of-Text': 'Large-Block-of-Text',
        'System-Field': 'System-Field',
    });

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DataTypePropertyComponent
            ],
            imports: [
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock },
            ]
        });

        fixture = DOTTestBed.createComponent(DataTypePropertyComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        this.group = new FormGroup({
            name: new FormControl('')
        });

        comp.group = this.group;
        comp.property = {
            field: {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableRadioField',
            },
            name: 'name',
            value: 'value'
        };
    }));

    it('should have a form', () => {
        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));

        expect(divForm).not.toBeNull();
        expect(this.group).toEqual(divForm.componentInstance.group);
    });

    it('should have 4 values for Radio Field', () => {

        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pRadioButtons = fixture.debugElement.queryAll(By.css('p-radioButton'));

        expect(4).toEqual(pRadioButtons.length);
        expect('Text').toBe(pRadioButtons[0].componentInstance.label);
        expect('TEXT').toBe(pRadioButtons[0].componentInstance.value);
        expect('True-False').toBe(pRadioButtons[1].componentInstance.label);
        expect('BOOL').toBe(pRadioButtons[1].componentInstance.value);
        expect('Decimal').toBe(pRadioButtons[2].componentInstance.label);
        expect('FLOAT').toBe(pRadioButtons[2].componentInstance.value);
        expect('Whole-Number').toBe(pRadioButtons[3].componentInstance.label);
        expect('INTEGER').toBe(pRadioButtons[3].componentInstance.value);
    });

    it('should have 4 values for Select Field', () => {
        comp.property.field.clazz = 'com.dotcms.contenttype.model.field.ImmutableSelectField';
        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pRadioButtons = fixture.debugElement.queryAll(By.css('p-radioButton'));

        expect(4).toEqual(pRadioButtons.length);
        expect('Text').toBe(pRadioButtons[0].componentInstance.label);
        expect('TEXT').toBe(pRadioButtons[0].componentInstance.value);
        expect('True-False').toBe(pRadioButtons[1].componentInstance.label);
        expect('BOOL').toBe(pRadioButtons[1].componentInstance.value);
        expect('Decimal').toBe(pRadioButtons[2].componentInstance.label);
        expect('FLOAT').toBe(pRadioButtons[2].componentInstance.value);
        expect('Whole-Number').toBe(pRadioButtons[3].componentInstance.label);
        expect('INTEGER').toBe(pRadioButtons[3].componentInstance.value);
    });

    it('should have 4 values for Text Field', () => {
        comp.property.field.clazz = 'com.dotcms.contenttype.model.field.ImmutableTextField';
        fixture.detectChanges();

        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));
        const pRadioButtons = fixture.debugElement.queryAll(By.css('p-radioButton'));

        expect(3).toEqual(pRadioButtons.length);
        expect('Text').toBe(pRadioButtons[0].componentInstance.label);
        expect('TEXT').toBe(pRadioButtons[0].componentInstance.value);
        expect('Decimal').toBe(pRadioButtons[1].componentInstance.label);
        expect('FLOAT').toBe(pRadioButtons[1].componentInstance.value);
        expect('Whole-Number').toBe(pRadioButtons[2].componentInstance.label);
        expect('INTEGER').toBe(pRadioButtons[2].componentInstance.value);
    });
});
