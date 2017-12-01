import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuModule } from 'primeng/primeng';
import { DotActionButtonComponent } from './dot-action-button.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ActionButtonComponent', () => {
    let comp: DotActionButtonComponent;
    let fixture: ComponentFixture<DotActionButtonComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotActionButtonComponent],
            imports: [
                BrowserAnimationsModule,
                MenuModule,
                RouterTestingModule.withRoutes([{
                    component: DotActionButtonComponent,
                    path: 'test'
                }])
            ]
        });

        fixture = TestBed.createComponent(DotActionButtonComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
    }));

    it('should have no-label class by default', () => {
        fixture.detectChanges();
        expect(de.nativeElement.classList).toContain('action-button--no-label');
    });

    it('should have no-label class by default', () => {
        comp.label = 'Hello World';
        fixture.detectChanges();
        expect(de.nativeElement.classList).not.toContain('action-button--no-label');
    });

    it('should have only button in default state', () => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('button'))).toBeDefined('button should exist');
        expect(fixture.debugElement.query(By.css('.action-button__label')) === null).toBe(true, 'label hidden by default');
        expect(fixture.debugElement.query(By.css('p-menu')) === null).toBe(true, 'menu hidden by default');
    });

    it('should have label', () => {
        comp.label = 'Hello World';
        fixture.detectChanges();
        const label = fixture.debugElement.query(By.css('.action-button__label'));
        expect(label.nativeElement.textContent).toBe('Hello World');
    });

    it('should have menu and pass the model', () => {
        comp.model = [{
            command: () => {},
            icon: 'whatever',
            label: 'Whatever'
        }];
        fixture.detectChanges();
        const menu = fixture.debugElement.query(By.css('p-menu'));
        expect(menu).toBeDefined();
    });

});
