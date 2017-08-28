import { Component, DebugElement, Type, SimpleChange } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../../test/dot-test-bed';
import { DynamicFieldPropertyDirective } from './dynamic-field-property.directive';
import { FieldPropertyService } from '../../../service';
import { FieldProperty } from '../field-properties.interface';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../';
import { By } from '@angular/platform-browser';

@Component({
    template: `<ng-container dynamicFieldProperty
                [propertyName]="propertyName"
                [group]="group"
                [field]="field"
               >`
})
class TestDinamicFieldPropertyDirectiveComponent {
    propertyName = 'name';
    field: Field = {
        name: 'fieldName'
    };
    group: FormGroup = new FormGroup({});
}

@Component({
    selector: 'test',
    template: '<h1>Testing</h1>'
})
class TestComponent {
    property: FieldProperty;
    group: FormGroup;
}

class MockFieldPropertyService {
    getComponent(propertyName: string): Type<any> {
        return null;
    }
}

xdescribe('Directive: DynamicFieldPropertyDirective', () => {
    let component: TestDinamicFieldPropertyDirectiveComponent;
    let fixture: ComponentFixture<TestDinamicFieldPropertyDirectiveComponent>;
    let debugElement: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DynamicFieldPropertyDirective,
                TestDinamicFieldPropertyDirectiveComponent,
            ],
            providers: [
                { provide: FieldPropertyService, useClass: MockFieldPropertyService },
            ]
        });

        fixture = DOTTestBed.createComponent(TestDinamicFieldPropertyDirectiveComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('Should create a element', () => {
        /*comp.ngOnChanges({
            field: new SimpleChange(null, {
                name: 'fieldName'
            }, true)
        });*/

        const testElement = fixture.debugElement.queryAllNodes(By.css('test'));
        console.log('testElement', testElement);
        console.log('fixture', fixture);
    });
});
