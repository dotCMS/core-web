import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By, DomSanitizer } from '@angular/platform-browser';
import { DebugElement, Input, Component, OnInit } from '@angular/core';
import { async, ComponentFixture } from '@angular/core/testing';

import { DOTTestBed } from '../../../test/dot-test-bed';
import { DialogModule, Dialog } from 'primeng/primeng';
import { DotIframeDialogComponent } from './dot-iframe-dialog.component';

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-iframe-dialog [url]="url"></dot-iframe-dialog>'
})
class TestHostComponent {
    url: string;
}

fdescribe('DotIframeDialogComponent', () => {
    let component: DotIframeDialogComponent;
    let de: DebugElement;
    let dialog: Dialog;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let sanitizer: DomSanitizer;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DialogModule, BrowserAnimationsModule],
            declarations: [DotIframeDialogComponent, TestHostComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(TestHostComponent);
        hostDe = hostFixture.debugElement;
        hostComponent = hostFixture.componentInstance;
        de = hostDe.query(By.css('dot-iframe-dialog'));
        component = de.componentInstance;
        sanitizer = de.injector.get(DomSanitizer);
    });

    describe('init', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            dialog = de.query(By.css('p-dialog')).componentInstance;
        });

        it('should have dialog component', () => {
            expect(dialog).toBeTruthy();
        });

        it('should have dialog hidden by default', () => {
            expect(dialog.visible).toEqual(false);
        });

        it('should have the right attrs in dialog', () => {
            expect(dialog.draggable).toEqual(false);
            expect(dialog.dismissableMask).toEqual(true);
            expect(dialog.modal).toEqual(true);
        });
    });

    fdescribe('show/hide', () => {
        let iframe: DebugElement;

        beforeEach(() => {
            hostComponent.url = 'hello/hello';
            hostFixture.detectChanges();
            dialog = de.query(By.css('p-dialog')).componentInstance;
            iframe = de.query(By.css('iframe'));
        });

        it('should show dialog', () => {
            expect(dialog.visible).toEqual(true);
        });

        it('should set sanitized url', () => {
            expect(component.safeUrl).toEqual(sanitizer.bypassSecurityTrustResourceUrl('hello/hello'));
        });

        it('should show the iframe', () => {
            expect(iframe).toBeTruthy();
        });

        it('should hide the dialog', () => {
            hostComponent.url = null;
            hostFixture.detectChanges();
            iframe = de.query(By.css('iframe'));
            dialog = de.query(By.css('p-dialog')).componentInstance;

            expect(iframe === null).toBe(true);
            expect(dialog.visible).toEqual(false);
        });
    });
});
