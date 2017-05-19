import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { SplitButtonModule, ButtonModule } from 'primeng/primeng';

import { ActionHeaderComponent } from './action-header';


class RouterMock {
    navigate(): string {
        return null;
    }
}

fdescribe('ActionHeaderComponent (inline template)', () => {

    let comp: ActionHeaderComponent;
    let fixture: ComponentFixture<ActionHeaderComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SplitButtonModule, ButtonModule],
            // tslint:disable-next-line:object-literal-sort-keys
            declarations: [ActionHeaderComponent],
            providers: [{ provide: Router, useClass: RouterMock }]
        });

        fixture = TestBed.createComponent(ActionHeaderComponent);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;
    }));

    it('Selected class initial state', () => {
        comp.selected = true;
        fixture.detectChanges();
        console.log(el);
        // el.querySelector('.action-hnpmeader');
        // expect(comp.selected).toBe(false);
    });

    // it('Overflow initial state', () => {
    //     expect(comp.dynamicOverflow).toBe('visible');
    // });

    // it('Overflow initial state', () => {
    //     expect(comp.selectedItems).toBe([]);
    // });
});