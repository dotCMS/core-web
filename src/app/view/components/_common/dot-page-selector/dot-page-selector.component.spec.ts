import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DotPageSelectorComponent } from './dot-page-selector.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotPageSelectorService } from './service/dot-page-selector.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'dot-fake-form',
    template: `
        <form [formGroup]="form">
            <dot-page-selector formControlName="page"></dot-page-selector>
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
            page: [{ value: 'c12fe7e6-d338-49d5-973b-2d974d57015b', disabled: false }]
        });
    }
}

describe('DotPageSelectorComponent', () => {
    let hostFixture: ComponentFixture<FakeFormComponent>;
    let hostDe: DebugElement;
    let component: DotPageSelectorComponent;
    let de: DebugElement;
    let autocomplete: DebugElement;
    let dotPageSelectorService: DotPageSelectorService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [FakeFormComponent, DotPageSelectorComponent],
            providers: [DotPageSelectorService]
        }).compileComponents();
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

    });

    it('should have autocomplete', () => {
        expect(autocomplete).toBeTruthy();
    });

    it('should search for pages', () => {
        autocomplete.triggerEventHandler('completeMethod', {
            query: 'hello'
        });

        expect(dotPageSelectorService.getPagesInFolder).toHaveBeenCalledWith('hello');
    });

    it('should emit selected item and propagate changes', () => {
        spyOn(component, 'propagateChange').and.callThrough();

        autocomplete.triggerEventHandler('onSelect', {a: 'page'});
        expect(component.selected.emit).toHaveBeenCalledWith({a: 'page'});
        expect(component.propagateChange).toHaveBeenCalledWith({a: 'page'});
    });

    it('should write value', () => {
        expect(component.writeValue).toHaveBeenCalledWith('c12fe7e6-d338-49d5-973b-2d974d57015b');
    });
});
