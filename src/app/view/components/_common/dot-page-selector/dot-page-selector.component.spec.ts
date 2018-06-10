import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotPageSelectorComponent } from './dot-page-selector.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotPageSelectorService } from './service/dot-page-selector.service';

fdescribe('DotPageSelectorComponent', () => {
    let component: DotPageSelectorComponent;
    let de: DebugElement;
    let fixture: ComponentFixture<DotPageSelectorComponent>;
    let autocomplete: DebugElement;
    let dotPageSelectorService: DotPageSelectorService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotPageSelectorComponent],
            providers: [DotPageSelectorService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotPageSelectorComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
        autocomplete = de.query(By.css('p-autoComplete'));
        dotPageSelectorService = de.injector.get(DotPageSelectorService);
        spyOn(component.selected, 'emit');
        spyOn(dotPageSelectorService, 'getPagesInFolder').and.callThrough();
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

    it('should emit selected item', () => {
        autocomplete.triggerEventHandler('onSelect', {a: 'page'});
        expect(component.selected.emit).toHaveBeenCalledWith({a: 'page'});
    });
});
