import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DotPageSelectorComponent } from './dot-page-selector.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotPageSelectorService } from './service/dot-page-selector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AutoComplete } from 'primeng/primeng';
import { DotDirectivesModule } from '../../../../shared/dot-directives.module';

@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-page-selector
                formControlName="page"
                [style]="{'width': '100%'}"
                label="Hello World">
            </dot-page-selector>
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
            page: [{ value: 'f9fc55e7-557a-4047-a8be-15e5ca69fa62', disabled: false }]
        });
    }
}

const config = (host) => {
    return {
        declarations: [host, DotPageSelectorComponent],
        imports: [DotDirectivesModule],
        providers: [DotPageSelectorService]
    };
};
let hostDe: DebugElement;
let component: DotPageSelectorComponent;
let de: DebugElement;
let autocomplete: DebugElement;
let autocompleteComp: AutoComplete;
let dotPageSelectorService: DotPageSelectorService;

describe('DotPageSelectorComponent', () => {
    let hostFixture: ComponentFixture<FakeFormComponent>;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule(config(FakeFormComponent)).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(FakeFormComponent);
        hostDe = hostFixture.debugElement;
        de = hostDe.query(By.css('dot-page-selector'));
        component = de.componentInstance;
        dotPageSelectorService = de.injector.get(DotPageSelectorService);

        spyOn(component.selected, 'emit');
        spyOn(dotPageSelectorService, 'getPagesInFolder').and.callThrough();
        spyOn(component, 'writeValue').and.callThrough();

        hostFixture.detectChanges();
        autocomplete = de.query(By.css('p-autoComplete'));
        autocompleteComp = autocomplete.componentInstance;

    });

    it('should have autocomplete', () => {
        expect(autocomplete).toBeTruthy();
    });

    it('shold not set floating label directive', () => {
        expect(de.query(By.css('[dotMdInputtext]')) === null).toBe(true);
    });

    it('should search for pages', () => {
        autocomplete.triggerEventHandler('completeMethod', {
            query: 'hello'
        });

        expect(dotPageSelectorService.getPagesInFolder).toHaveBeenCalledWith('hello');
    });

    it('should pass attritubes', () => {
        expect(autocompleteComp.style).toEqual({'width': '100%'});
        expect(autocompleteComp.placeholder).toEqual('Hello World');
    });

    describe('ControlValueAccessor', () => {
        beforeEach(() => {
            spyOn(component, 'propagateChange').and.callThrough();
        });

        it('should emit selected item and propagate changes', () => {

            autocomplete.triggerEventHandler('onSelect', {identifier: '123'});
            expect(component.selected.emit).toHaveBeenCalledWith({identifier: '123'});
            expect(component.propagateChange).toHaveBeenCalledWith('123');
        });

        it('should write value', () => {
            expect(component.writeValue).toHaveBeenCalledWith('f9fc55e7-557a-4047-a8be-15e5ca69fa62');
            expect(component.val.identifier).toEqual('f9fc55e7-557a-4047-a8be-15e5ca69fa62');
        });

        it('should clear model and suggections', () => {
            autocomplete.triggerEventHandler('onClear', {});
            expect(component.propagateChange).toHaveBeenCalledWith(null);
            expect(component.results).toEqual([]);
        });
    });
});

@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-page-selector
                formControlName="page"
                [style]="{'width': '100%'}"
                label="Hello World"
                [floatingLabel]="true">
            </dot-page-selector>
        </form>
    `
})
class FakeForm2Component {
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        /*
            This should go in the ngOnInit but I don't want to detectChanges everytime for
            this fake test component
        */
        this.form = this.fb.group({
            page: [{ value: 'f9fc55e7-557a-4047-a8be-15e5ca69fa62', disabled: false }]
        });
    }
}

describe('DotPageSelectorComponent with floating label', () => {
    let hostFixture: ComponentFixture<FakeForm2Component>;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule(config(FakeForm2Component)).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(FakeForm2Component);
        hostDe = hostFixture.debugElement;
        de = hostDe.query(By.css('dot-page-selector'));

        hostFixture.detectChanges();
        autocomplete = de.query(By.css('p-autoComplete'));
        autocompleteComp = autocomplete.componentInstance;
    });

    it('should set floating label directive', () => {
        const span: DebugElement = de.query(By.css('[dotMdInputtext]'));
        expect(span.componentInstance.label).toBe('Hello World');
        expect(span).toBeTruthy();
    });

    it('should not have placeholder', () => {
        expect(autocompleteComp.placeholder).toBeUndefined();
    });
});
