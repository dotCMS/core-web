import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DotIconModule } from '../dot-icon/dot-icon.module';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotIconButtonComponent } from './dot-icon-button.component';
import { By } from '@angular/platform-browser';

describe('DotIconButtonComponent', () => {
    let comp: DotIconButtonComponent;
    let fixture: ComponentFixture<DotIconButtonComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotIconButtonComponent],
            imports: [DotIconModule]
        });

        fixture = TestBed.createComponent(DotIconButtonComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
    });

    it('should render component with dot-icon component and css classes', () => {
        comp.icon = 'test';
        comp.tiny = true;
        comp.inverted = true;
        fixture.detectChanges();

        const icon = fixture.debugElement.query(By.css('dot-icon'));
        expect(de.nativeElement.childNodes[0].classList).toContain('dot-icon-button');
        expect(de.nativeElement.childNodes[0].classList).toContain('tiny');

        expect(icon.componentInstance.tiny).toBe('true');
        expect(icon.componentInstance.inverted).toBe('true');
        expect(icon.componentInstance.name).toBe('test');
    });

    it('should emit event on button click', () => {
        let res;

        comp.click.subscribe((event) => {
            res = event;
        });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.dot-icon-button'));
        button.nativeElement.click();
        expect(res).toBeDefined();
    });

    it('should set button to disabled state', () => {
        comp.disabled = true;
        comp.icon = 'test';

        let res;

        comp.click.subscribe((event) => {
            res = event;
        });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.dot-icon-button'));
        button.nativeElement.click();
        expect(res).not.toBeDefined();
        expect(button.nativeElement.classList).toContain('disabled');
    });
});
