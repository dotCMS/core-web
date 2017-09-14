import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectButtonModule, InputTextareaModule } from 'primeng/primeng';

import { DotTextareaContentComponent } from './dot-textarea-content.component';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { AceEditorModule } from 'ng2-ace-editor';
import { TinymceModule } from 'angular2-tinymce';

function cleanOptionText(option) {
    return option.replace(/\r?\n|\r/g, '');
}

fdescribe('DotTextareaContentComponent', () => {
    let component: DotTextareaContentComponent;
    let fixture: ComponentFixture<DotTextareaContentComponent>;
    let de: DebugElement;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DotTextareaContentComponent],
                imports: [
                    AceEditorModule,
                    SelectButtonModule,
                    InputTextareaModule,
                    TinymceModule.withConfig({})
                ]
            });
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTextareaContentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should have a select mode field', () => {
        const selectField = de.query(By.css('.textarea-content__select-field'));
        expect(selectField).not.toBeFalsy();
    });

    it('should have a 3 options in the select mode field', () => {
        const selectFieldWrapper = de.query(
            By.css('.textarea-content__select-field .ui-selectbutton')
        );
        expect(selectFieldWrapper.children.length).toEqual(3);
    });

    it('should have options: plain, code and wysiwyg in the select mode field', () => {
        const options = ['Plain', 'Code', 'WYSIWYG'];
        const selectFieldWrapper = de.query(
            By.css('.textarea-content__select-field .ui-selectbutton')
        );

        selectFieldWrapper.children.forEach(option => {
            const optionText = cleanOptionText(option.nativeElement.innerText);
            expect(options.indexOf(optionText)).toBeGreaterThan(-1);
        });
    });

    it(
        'should have selected \'Plain\' option as default',
        async(() => {
            /*
                We need to to async and whenStable here because the ngModel in the PrimeNg component
            */
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const selectedOption = de.query(
                    By.css('.textarea-content__select-field .ui-state-active')
                );
                const defaultOptionText = cleanOptionText(selectedOption.nativeElement.innerText);
                expect(defaultOptionText).toBe('Plain');
            });
        })
    );

    /*
        ng2-ace-editor module it's not working as spected with async tests, needs to look for a workaround
    */
    xit(
        'should have selected \'Code\' option',
        async(() => {
            /*
                We need to to async and whenStable here because the ngModel in the PrimeNG component
            */
            component.selected = 'code';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const selectedOption = de.query(
                    By.css('.textarea-content__select-field .ui-state-active')
                );
                const selectedOptionText = cleanOptionText(selectedOption.nativeElement.innerText);
                expect(selectedOptionText).toBe('Code');
            });
        })
    );

    it('should have a \'Plain\' field by default', () => {
        const plainFieldTexarea = de.query(By.css('.textarea-content__plain-field'));
        expect(plainFieldTexarea).toBeTruthy('show plain field');
        /*
            We should be using .toBeFalsey() but there is a bug with this method:
            https://github.com/angular/angular/issues/14235
        */
        const codeFieldTexarea = de.query(By.css('.textarea-content__code-field'));
        expect(codeFieldTexarea == null).toBe(true, 'hide code field');

        const wysiwygFieldTexarea = de.query(By.css('.textarea-content__wysiwyg-field'));
        expect(wysiwygFieldTexarea == null).toBe(true, 'hide wysiwyg field');
    });

    it('should show \'Code\' field by passing the param', () => {
        component.selected = 'code';
        fixture.detectChanges();

        const codeFieldTexarea = de.query(By.css('.textarea-content__code-field'));
        expect(codeFieldTexarea).toBeTruthy('show code field');

        /*
            We should be using .toBeFalsey() but there is a bug with this method:
            https://github.com/angular/angular/issues/14235
        */
        const plainFieldTexarea = de.query(By.css('.textarea-content__plain-field'));
        expect(plainFieldTexarea == null).toBe(true, 'hide plain field');
        const wysiwygFieldTexarea = de.query(By.css('.textarea-content__wysiwyg-field'));
        expect(wysiwygFieldTexarea == null).toBe(true, 'hide wysiwyg field');
    });

    it('should show \'WYSIWYG\' field by passing the param', () => {
        component.selected = 'wysiwyg';
        fixture.detectChanges();

        const wysiwygFieldTexarea = de.query(By.css('.textarea-content__wysiwyg-field'));
        expect(wysiwygFieldTexarea).toBeTruthy('show wysiwyg field');

        /*
            We should be using .toBeFalsey() but there is a bug with this method:
            https://github.com/angular/angular/issues/14235
        */
        const plainFieldTexarea = de.query(By.css('.textarea-content__plain-field'));
        expect(plainFieldTexarea == null).toBe(true, 'hide plain field');
        const codeFieldTexarea = de.query(By.css('.textarea-content__code-field'));
        expect(codeFieldTexarea == null).toBe(true, 'hide code field');
    });
});
