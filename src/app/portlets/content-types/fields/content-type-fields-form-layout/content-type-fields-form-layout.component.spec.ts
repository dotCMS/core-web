import { ContentTypeFieldsFormLayoutComponent } from './content-type-fields-form-layout.component';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Component, Input } from '@angular/core';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { By } from '@angular/platform-browser';
import { MockMessageService } from '../../../../test/message-service.mock';
import { MessageService } from '../../../../api/services/messages-service';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'dot-content-type-fields-properties-form',
    template: ''
})
class TestContentTypeFieldsPropertiesComponent {
    @Input() form;
    @Input() formFieldData;
}

@Component({
    selector: 'dot-content-type-fields-variables',
    template: ''
})
class TestContentTypeFieldsVariablesComponent {
    @Input() form;
    @Input() field; Field;

    removeEmptyRow(): void {
    }
}

@Component({
    template: `<dot-content-type-fields-form-layout [field]="field">
               </dot-content-type-fields-form-layout>`
})
class TestHostComponent {
    field; Field;
}

function setUnvalidForm(form) {
      // to force a unvalid form
      form.addControl('testing', new FormControl(null, Validators.required));
}

function setValidForm(form) {
    // to force a unvalid form
    form.addControl('testing', new FormControl('testing', Validators.required));
}

describe('ContentTypeFieldsFormLayout', () => {
    let comp: ContentTypeFieldsFormLayoutComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {

        const messageServiceMock = new MockMessageService({
            'contenttypes.field.properties.label': 'Properties',
            'contenttypes.field.variables.label': 'Variables',
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsFormLayoutComponent,
                TestContentTypeFieldsPropertiesComponent,
                TestContentTypeFieldsVariablesComponent,
                TestHostComponent
            ],
            imports: [
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ],
        });

        fixture = DOTTestBed.createComponent(TestHostComponent);
        de = fixture.debugElement.query(By.css('dot-content-type-fields-form-layout'));
        comp = de.componentInstance;
        el = de.nativeElement;

        fixture.detectChanges();
    }));

    it('should has a tab-view', () => {
        const tabView = de.query(By.css('p-tabView'));
        expect(tabView).not.toBeNull();
    });

    it('should has a form', () => {
        expect(comp.form).toBeDefined();
    });

    it('should return null', () => {
      setUnvalidForm(comp.form);
      const fieldVariablesElement = de.query(By.css('dot-content-type-fields-variables'));
      const spyRemoveEmptyRow = spyOn(fieldVariablesElement.componentInstance, 'removeEmptyRow');

      expect(comp.value).toBeNull();
      expect(spyRemoveEmptyRow).toHaveBeenCalled();
    });

    it('should return form.value', () => {
        setValidForm(comp.form);
        const fieldVariablesElement = de.query(By.css('dot-content-type-fields-variables'));
        const spyRemoveEmptyRow = spyOn(fieldVariablesElement.componentInstance, 'removeEmptyRow');

        expect(comp.value).toEqual({
            testing: 'testing'
        });
        expect(spyRemoveEmptyRow).toHaveBeenCalled();
    });

    describe('Tab properties', () => {

        let tabView;
        let tabPanel;

        beforeEach(async(() => {
            tabView = de.query(By.css('p-tabView'));
            tabPanel = tabView.query(By.css('.content-type-field__properties'));
        }));

        it('should has a properties tab', () => {
            expect(tabPanel).not.toBeNull();
            expect('Properties').toBe(tabPanel.componentInstance.header);
        });

        it('should has a dot-content-type-fields-properties-form', () => {
            const propertiesFormElement = tabView.query(By.css('dot-content-type-fields-properties-form'));
            expect(propertiesFormElement).not.toBeNull();
        });

        it('should set the form attributes', () => {
            const propertiesFormElement = tabView.query(By.css('dot-content-type-fields-properties-form'));
            expect(comp.form).toBe(propertiesFormElement.componentInstance.form);
        });

        it('should set the formFieldData attributes', () => {
            fixture.componentInstance.field = {
                name: 'field name'
            };

            fixture.detectChanges();

            const propertiesFormElement = tabView.query(By.css('dot-content-type-fields-properties-form'));

            expect(comp.field).toBe(propertiesFormElement.componentInstance.formFieldData);
        });
    });

    describe('Tab variables', () => {
        let tabView;

        beforeEach(async(() => {
            tabView = de.query(By.css('p-tabView'));

            fixture.componentInstance.field = {
                name: 'field name'
            };
        }));

        it('should has variables tab disabled', () => {
            setUnvalidForm(comp.form);
            fixture.detectChanges();

            const tabPanel = tabView.query(By.css('.content-type-field__variables'));
            expect(true).toEqual(tabPanel.componentInstance.disabled);
        });

        it('should has a header', () => {
            setValidForm(comp.form);
            fixture.detectChanges();

            const tabPanel = tabView.query(By.css('.content-type-field__variables'));
            expect(tabPanel).toBeDefined('should exists a variables tab');
            expect('Variables').toBe(tabPanel.componentInstance.header, 'should has the right header');
        });

        it('should has a dot-content-type-fields-variables', () => {
            setValidForm(comp.form);
            fixture.detectChanges();

            const tabPanel = tabView.query(By.css('.content-type-field__variables'));
            const fieldVariablesElement = tabPanel.query(By.css('dot-content-type-fields-variables'));
            expect(fieldVariablesElement).toBeDefined();
        });

        it('should set the field attributes', () => {
            fixture.detectChanges();
            const fieldVariablesElement = tabView.query(By.css('dot-content-type-fields-variables'));
            expect(comp.field).toBe(fieldVariablesElement.componentInstance.field);
        });

        it('should set the field attributes', () => {
            fixture.detectChanges();
            const fieldVariablesElement = tabView.query(By.css('dot-content-type-fields-variables'));
            expect(comp.field).toBe(fieldVariablesElement.componentInstance.field);
        });
    });
});
