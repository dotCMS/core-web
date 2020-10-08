import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DotAppsConfigurationDetailFormComponent } from './dot-apps-configuration-detail-form.component';

import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { DebugElement } from '@angular/core';

const secrets = [
    {
        dynamic: false,
        name: 'name',
        hidden: false,
        hint: 'This is a Name',
        label: 'Name:',
        required: true,
        type: 'STRING',
        value: 'test'
    },
    {
        dynamic: false,
        name: 'password',
        hidden: true,
        hint: 'This is a password',
        label: 'Password:',
        required: true,
        type: 'STRING',
        value: '****'
    },
    {
        dynamic: false,
        name: 'enabled',
        hidden: false,
        hint: 'This is Enabled!',
        label: 'Enabled:',
        required: false,
        type: 'BOOL',
        value: 'true'
    },
    {
        dynamic: false,
        name: 'select',
        hidden: false,
        hint: 'This is Select!',
        label: 'Select label:',
        options: [
            {
                label: 'uno',
                value: '1'
            },
            {
                label: 'dos',
                value: '2'
            }
        ],
        required: true,
        type: 'SELECT',
        value: '1'
    }
];

const formState = {
    name: secrets[0].value,
    password: secrets[1].value,
    enabled: JSON.parse(secrets[2].value),
    select: secrets[3].options[0].value
};

describe('DotAppsConfigurationDetailFormComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                CommonModule,
                CheckboxModule,
                DropdownModule,
                DotIconModule,
                InputTextareaModule,
                InputTextModule,
                MarkdownModule,
                ReactiveFormsModule,
                TooltipModule
            ],
            declarations: [DotAppsConfigurationDetailFormComponent],
            providers: [
                {
                    provide: MarkdownService,
                    useValue: {
                        compile(text) {
                            return text;
                        },

                        highlight() {}
                    }
                }
            ]
        });
    });

    describe('Without warnings', () => {
        let component: DotAppsConfigurationDetailFormComponent;
        let fixture: ComponentFixture<DotAppsConfigurationDetailFormComponent>;
        let de: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(DotAppsConfigurationDetailFormComponent);
            de = fixture.debugElement;
            component = de.componentInstance;
            component.formFields = secrets;
            spyOn(component.data, 'emit');
            spyOn(component.valid, 'emit');
            fixture.detectChanges();
        });

        it('should load form components', () => {
            expect(de.queryAll(By.css('.dot-apps-configuration-detail__form-row')).length).toBe(
                secrets.length
            );
        });

        it('should not have warning icon', () => {
            expect(de.query(By.css('dot-icon'))).toBeFalsy();
        });

        it('should focus on first input when loaded', async () => {
            const focusField = component.formContainer.nativeElement.querySelector('#name');
            spyOn(focusField, 'focus');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(focusField.focus).toHaveBeenCalledTimes(1);
        });

        it('should load Label, Textarea & Hint with right attributes', () => {
            const row = de.queryAll(By.css('.dot-apps-configuration-detail__form-row'))[0];
            expect(row.query(By.css('markdown'))).toBeTruthy();
            expect(row.query(By.css('label')).nativeElement.textContent).toBe(secrets[0].label);
            expect(
                row.query(By.css('label')).nativeElement.classList.contains('form__label')
            ).toBeTruthy();
            expect(
                row.query(By.css('label')).nativeElement.classList.contains('required')
            ).toBeTruthy();
            expect(row.query(By.css('textarea')).nativeElement.attributes.id.value).toBe(
                secrets[0].name
            );
            expect(row.query(By.css('textarea')).nativeElement.attributes.autoResize.value).toBe(
                'autoResize'
            );
            expect(row.query(By.css('textarea')).nativeElement.value).toBe(secrets[0].value);
            expect(row.query(By.css('.form__group-hint')).nativeElement.textContent).toBe(
                secrets[0].hint
            );
        });

        it('should load Checkbox & Hint with right attributes', () => {
            const row = de.queryAll(By.css('.dot-apps-configuration-detail__form-row'))[2];
            expect(row.query(By.css('markdown'))).toBeTruthy();
            expect(row.query(By.css('p-checkbox')).nativeElement.attributes.id.value).toBe(
                secrets[2].name
            );
            expect(row.query(By.css('p-checkbox')).componentInstance.label).toBe(secrets[2].label);
            expect(row.query(By.css('input')).nativeElement.value).toBe(secrets[2].value);
            expect(row.query(By.css('.form__group-hint')).nativeElement.textContent).toBe(
                secrets[2].hint
            );
        });

        it('should load Label, Select & Hint with right attributes', () => {
            const row = de.queryAll(By.css('.dot-apps-configuration-detail__form-row'))[3];
            expect(row.query(By.css('markdown'))).toBeTruthy();
            expect(row.query(By.css('label')).nativeElement.textContent).toBe(secrets[3].label);
            expect(
                row.query(By.css('label')).nativeElement.classList.contains('form__label')
            ).toBeTruthy();
            expect(
                row.query(By.css('label')).nativeElement.classList.contains('required')
            ).toBeTruthy();
            expect(row.query(By.css('p-dropdown')).nativeElement.id).toBe(secrets[3].name);
            expect(row.query(By.css('p-dropdown')).componentInstance.options).toBe(
                secrets[3].options
            );
            expect(row.query(By.css('p-dropdown')).componentInstance.value).toBe(
                secrets[3].options[0].value
            );
            expect(row.query(By.css('.form__group-hint')).nativeElement.textContent).toBe(
                secrets[3].hint
            );
        });

        it('should emit form state when loaded', () => {
            expect(component.data.emit).toHaveBeenCalledWith(formState);
            expect(component.valid.emit).toHaveBeenCalledWith(true);
        });

        it('should emit form state when value changed', () => {
            component.myFormGroup.get('name').setValue('Test2');
            component.myFormGroup.get('password').setValue('Password2');
            component.myFormGroup.get('enabled').setValue('false');
            expect(component.data.emit).toHaveBeenCalledTimes(4);
            expect(component.valid.emit).toHaveBeenCalledTimes(4);
        });

        it('should emit form state disabled when required field empty', () => {
            component.myFormGroup.get('name').setValue('');
            expect(component.valid.emit).toHaveBeenCalledWith(false);
        });
    });

    describe('With warnings', () => {
        let component: DotAppsConfigurationDetailFormComponent;
        let fixture: ComponentFixture<DotAppsConfigurationDetailFormComponent>;
        let de: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(DotAppsConfigurationDetailFormComponent);
            de = fixture.debugElement;
            component = de.componentInstance;
            component.formFields = secrets.map((item, i) => {
                if (i < 3) {
                    return {
                        ...item,
                        warnings: [`error ${i}`]
                    };
                }
                return item;
            });
            fixture.detectChanges();
        });

        it('should have warning icons', () => {
            const warningIcons = de.queryAll(By.css('dot-icon'));
            expect(warningIcons[0].attributes['name']).toBe('warning');
            expect(warningIcons[0].attributes['size']).toBe('18');
            expect(warningIcons[0].attributes['ng-reflect-text']).toBe(
                component.formFields[0].warnings[0]
            );
            expect(warningIcons[1].attributes['name']).toBe('warning');
            expect(warningIcons[1].attributes['size']).toBe('18');
            expect(warningIcons[1].attributes['ng-reflect-text']).toBe(
                component.formFields[1].warnings[0]
            );
            expect(warningIcons[2].attributes['name']).toBe('warning');
            expect(warningIcons[2].attributes['size']).toBe('18');
            expect(warningIcons[2].attributes['ng-reflect-text']).toBe(
                component.formFields[2].warnings[0]
            );
        });
    });
});
