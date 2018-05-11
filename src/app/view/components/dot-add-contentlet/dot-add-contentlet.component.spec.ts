/* tslint:disable:no-unused-variable */
import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DotAddContentletComponent } from './dot-add-contentlet.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotIframeDialogModule } from '../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotIframeDialogComponent } from '../dot-iframe-dialog/dot-iframe-dialog.component';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { Observable } from 'rxjs/Observable';
import { DotAddContentLet, DotAddContentletService } from './services/dot-add-contentlet.service';

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-add-contentlet></dot-add-contentlet>'
})
class TestHostComponent {
}

describe('DotAddContentletComponent', () => {
    let component: DotAddContentletComponent;
    let de: DebugElement;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;

    let dotIframeDialog: DebugElement;
    let dotIframeDialogComponent: DotIframeDialogComponent;

    let dotAddContentletService: DotAddContentletService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotAddContentletComponent, TestHostComponent],
            providers: [
                DotAddContentletService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                },
                {
                    provide: DotMenuService,
                    useValue: {
                        getDotMenuId() {
                            return Observable.of('999');
                        }
                    }
                }
            ],
            imports: [DotIframeDialogModule, RouterTestingModule, BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(TestHostComponent);
        hostDe = hostFixture.debugElement;
        hostComponent = hostFixture.componentInstance;
        de = hostDe.query(By.css('dot-add-contentlet'));
        component = de.componentInstance;
        dotAddContentletService = hostDe.injector.get(DotAddContentletService);
        spyOn(dotAddContentletService, 'clear');
    });

    describe('default', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));
        });

        it('should have', () => {
            expect(dotIframeDialog).toBeTruthy();
        });
    });

    describe('with inode', () => {
        beforeEach(() => {
            hostFixture.detectChanges();

            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));
            dotIframeDialogComponent = dotIframeDialog.componentInstance;

            dotAddContentletService.add({
                container: '123',
                type: 'content',
                load: jasmine.createSpy(),
                keyDown: jasmine.createSpy()
            });

            spyOn(component, 'onClose').and.callThrough();
            spyOn(component, 'onLoad').and.callThrough();
            spyOn(component, 'onKeyDown').and.callThrough();
        });

        describe('events', () => {
            it('should call clear', () => {
                dotIframeDialog.triggerEventHandler('close', {});
                expect(component.onClose).toHaveBeenCalledTimes(1);
                expect(dotAddContentletService.clear).toHaveBeenCalledTimes(1);
            });

            it('should call load', () => {
                dotIframeDialog.triggerEventHandler('load', { hello: 'world' });
                expect(component.onLoad).toHaveBeenCalledTimes(1);
                expect(dotAddContentletService.load).toHaveBeenCalledWith({ hello: 'world' });
            });

            it('should call keyDown', () => {
                dotIframeDialog.triggerEventHandler('keydown', { hello: 'world' });
                expect(component.onKeyDown).toHaveBeenCalledTimes(1);
                expect(dotAddContentletService.keyDown).toHaveBeenCalledWith({ hello: 'world' });
            });
        });

        describe('dot-iframe-dialog', () => {
            it('should have set url to', () => {
                expect(dotIframeDialogComponent.url).toBe('/html/ng-contentlet-selector.jsp?ng=true&container_id=123&add=content,form');
            });
        });

        it('should hide', () => {
            // hostComponent.data = null;
            hostFixture.detectChanges();
            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));

            expect(dotIframeDialog === null).toBe(true);
        });
    });
});
