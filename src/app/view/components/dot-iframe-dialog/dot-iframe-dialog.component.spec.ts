import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By, DomSanitizer } from '@angular/platform-browser';
import { DebugElement, Input, Component, OnInit } from '@angular/core';
import { async, ComponentFixture } from '@angular/core/testing';

import { DOTTestBed } from '../../../test/dot-test-bed';
import { DialogModule, Dialog } from 'primeng/primeng';
import { DotIframeDialogComponent } from './dot-iframe-dialog.component';
import { IFrameModule } from '../_common/iframe';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { IframeComponent } from '../_common/iframe/iframe-component';

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-iframe-dialog [url]="url"></dot-iframe-dialog>'
})
class TestHostComponent {
    url: string;
}

describe('DotIframeDialogComponent', () => {
    let component: DotIframeDialogComponent;
    let de: DebugElement;
    let dialog: DebugElement;
    let dialogComponent: Dialog;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let sanitizer: DomSanitizer;
    let dotIframe: DebugElement;
    let dotIframeComponent: IframeComponent;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DialogModule, BrowserAnimationsModule, IFrameModule, RouterTestingModule],
            providers: [
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ],
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

    describe('default', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            dialog = de.query(By.css('p-dialog'));
            dotIframe = de.query(By.css('dot-iframe'));
        });

        describe('dialog', () => {
            it('should not have', () => {
                expect(dialog === null).toBe(true);
            });
        });

        describe('iframe', () => {
            it('should not have', () => {
                expect(dotIframe === null).toBe(true);
            });
        });
    });

    describe('show', () => {
        beforeEach(() => {
            hostComponent.url = 'hello/world';
            hostFixture.detectChanges();
        });

        describe('dialog', () => {
            beforeEach(() => {
                dialog = de.query(By.css('p-dialog'));
                dialogComponent = dialog.componentInstance;
            });

            it('should have', () => {
                expect(dialog).toBeTruthy();
            });

            it('should have the right attrs', () => {
                expect(dialogComponent.visible).toEqual(true, 'visible');
                expect(dialogComponent.draggable).toEqual(false, 'draggable');
                expect(dialogComponent.dismissableMask).toEqual(true, 'dismissableMask');
                expect(dialogComponent.modal).toEqual(true, 'modal');
            });
        });

        describe('dot-iframe', () => {
            beforeEach(() => {
                dotIframe = de.query(By.css('dot-iframe'));
                dotIframeComponent = dotIframe.componentInstance;
            });

            it('should have', () => {
                expect(dotIframe).toBeTruthy();
            });

            it('should have the right attrs', () => {
                expect(dotIframeComponent.src).toBe('hello/world');
            });
        });
    });

    describe('show/hide', () => {
        beforeEach(() => {
            hostComponent.url = 'hello/world';
            hostFixture.detectChanges();
            dialog = de.query(By.css('p-dialog'));
            dotIframe = de.query(By.css('dot-iframe'));
        });

        it('should update', () => {
            expect(dialog).toBeTruthy();
            expect(dotIframe).toBeTruthy();

            hostComponent.url = null;
            hostFixture.detectChanges();
            dialog = de.query(By.css('p-dialog'));
            dotIframe = de.query(By.css('dot-iframe'));

            expect(dialog === null).toBe(true);
            expect(dotIframe === null).toBe(true);
        });
    });
});
