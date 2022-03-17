import { ComponentFixture, waitForAsync } from '@angular/core/testing';

import { DotContentTypeCloneDialogComponent } from './dot-content-type-clone-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { DotMdIconSelectorModule } from '@components/_common/dot-md-icon-selector/dot-md-icon-selector.module';
import { SiteSelectorFieldModule } from '@components/_common/dot-site-selector-field/dot-site-selector-field.module';
import { SiteService } from '@dotcms/dotcms-js';
import { SiteServiceMock } from '@tests/site-service.mock';
import { DotFormSelectorModule } from '@portlets/dot-edit-page/content/components/dot-form-selector/dot-form-selector.module';
import { DOTTestBed } from '@dotcms/app/test/dot-test-bed';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';

@Component({
    selector: 'dot-test-host-component',
    template: `
        <dot-content-type-clone-dialog
            [isVisibleDialog]="isVisibleDialog"
            [isSaving]="isSaving"
        ></dot-content-type-clone-dialog>
    `
})
class TestHostComponent {
    @Input() isVisibleDialog: boolean;
    @Input() isSaving: boolean;
}

const formValues = {
    name: 'Name of the copied content type',
    variable: 'variable-name',
    folder: '',
    host: '',
    icon: ''
};

describe('DotContentTypeCloneDialogComponent', () => {
    const siteServiceMock = new SiteServiceMock();
    let component: DotContentTypeCloneDialogComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let dotdialog: DebugElement;

    beforeEach(
        waitForAsync(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DotContentTypeCloneDialogComponent, TestHostComponent],
                imports: [
                    DotFormSelectorModule,
                    BrowserAnimationsModule,
                    DotFieldValidationMessageModule,
                    DotMdIconSelectorModule,
                    SiteSelectorFieldModule,
                    DotDialogModule
                ],
                providers: [{ provide: SiteService, useValue: siteServiceMock }]
                //schemas: [CUSTOM_ELEMENTS_SCHEMA]
            });
            fixture = DOTTestBed.createComponent(TestHostComponent);
            de = fixture.debugElement.query(By.css('dot-content-type-clone-dialog'));
            component = de.componentInstance;
            fixture.detectChanges();
            dotdialog = de.query(By.css('dot-dialog'));

            component.isVisibleDialog = true;
            fixture.detectChanges();
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have a form', () => {
        fixture.detectChanges();
        const form: DebugElement = de.query(By.css('form'));
        expect(form).not.toBeNull();
        expect(component.form).toEqual(form.componentInstance.form);
    });
    it('should be invalid if no name was added', () => {
        fixture.detectChanges();
        expect(component.form.valid).toEqual(false);
    });
    it('should be valid if bundle field is added', () => {
        fixture.detectChanges();

        component.form.setValue(formValues);
        expect(component.form.valid).toEqual(true);
    });
    it('should call cancelBtn() on cancel button click', async () => {
        const cancelButton: DebugElement = dotdialog.query(By.css('.dialog__button-cancel'));
        expect(cancelButton).toBeDefined();

        spyOn(component, 'closeDialog');

        cancelButton.nativeElement.click();

        expect(component.closeDialog).toHaveBeenCalledTimes(1);

        component.cancelBtn.subscribe((res) => {
            expect(res).toEqual(true);
        });
    });

    it('should call submitForm() on Copy button click and form valid', async () => {
        const copyButton: DebugElement = dotdialog.query(By.css('.dialog__button-accept'));
        expect(copyButton).toBeDefined();

        component.form.setValue(formValues);
        expect(component.form.valid).toEqual(true);

        spyOn(component, 'submitForm');

        fixture.detectChanges();

        copyButton.nativeElement.click();

        expect(component.submitForm).toHaveBeenCalledTimes(1);
    });

    it("shouldn't call submitForm() on Copy button click and form invalid", async () => {
        const copyButton: DebugElement = dotdialog.query(By.css('.dialog__button-accept'));
        expect(copyButton).toBeDefined();

        expect(component.form.valid).toEqual(false);
        spyOn(component, 'submitForm');

        fixture.detectChanges();
        copyButton.nativeElement.click();

        expect(component.submitForm).toHaveBeenCalledTimes(0);
    });
});
