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

            fixture = TestBed.createComponent(DotTextareaContentComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
        })
    );

    it('should show a select mode buttons by default', () => {
        fixture.detectChanges();
        const selectField = de.query(By.css('.textarea-content__select-field'));
        expect(selectField).not.toBeFalsy();
    });

    it('should have options: plain, code and wysiwyg in the select mode buttons by default', () => {
        fixture.detectChanges();
        const selectFieldWrapper = de.query(
            By.css('.textarea-content__select-field .ui-selectbutton')
        );

        selectFieldWrapper.children.forEach(option => {
            const optionText = cleanOptionText(option.nativeElement.innerText);
            expect(['Plain', 'Code', 'WYSIWYG'].indexOf(optionText)).toBeGreaterThan(-1);
        });
    });

    it('should hide select mode buttons when only one option to show is passed', () => {
        component.show = ['code'];
        fixture.detectChanges();
        const selectField = de.query(By.css('.textarea-content__select-field'));
        expect(selectField == null).toBe(true, 'hide buttons');
    });

    it(
        'should have option \'Plain\' selected by default',
        async(() => {
            fixture.detectChanges();
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

    it('should show \'Plain\' field by default', () => {
        fixture.detectChanges();
        const plainFieldTexarea = de.query(By.css('.textarea-content__plain-field'));
        expect(plainFieldTexarea).toBeTruthy('show plain field');
        /*
            We should be u
            sing .toBeFalsey() but there is a bug with this method:
            https://github.com/angular/angular/issues/14235
        */
        const codeFieldTexarea = de.query(By.css('.textarea-content__code-field'));
        expect(codeFieldTexarea == null).toBe(true, 'hide code field');

        const wysiwygFieldTexarea = de.query(By.css('.textarea-content__wysiwyg-field'));
        expect(wysiwygFieldTexarea == null).toBe(true, 'hide wysiwyg field');
    });

    it('should have only options we passed in the select mode butons', () => {
        component.show = ['wysiwyg', 'plain'];
        fixture.detectChanges();
        const selectFieldWrapper = de.query(
            By.css('.textarea-content__select-field .ui-selectbutton')
        );
        selectFieldWrapper.children.forEach(option => {
            const optionText = cleanOptionText(option.nativeElement.innerText);
            expect(['Plain', 'Wysiwyg'].indexOf(optionText)).toBeGreaterThan(-1, `${optionText} exist`);
        });
    });

    it('should show by default the first mode we passed', async(() => {
        component.show = ['wysiwyg', 'plain'];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
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

    }));
});
