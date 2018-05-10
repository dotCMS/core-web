/* tslint:disable:no-unused-variable */
import { async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotIframeDialogModule } from '../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotIframeDialogComponent } from '../dot-iframe-dialog/dot-iframe-dialog.component';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-edit-contentlet [inode]="inode"></dot-edit-contentlet>'
})
class TestHostComponent {
    inode: string;
}

describe('DotEditContentletComponent', () => {
    let component: DotEditContentletComponent;
    let de: DebugElement;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;

    let dotIframeDialog: DebugElement;
    let dotIframeDialogComponent: DotIframeDialogComponent;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotEditContentletComponent, TestHostComponent],
            providers: [
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
        de = hostDe.query(By.css('dot-edit-contentlet'));
        component = de.componentInstance;
    });

    describe('default', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));
        });

        it('should not have dot-iframe-dialog', () => {
            expect(dotIframeDialog === null).toBe(true);
        });
    });

    describe('with inode', () => {
        beforeEach(() => {
            hostComponent.inode = '123';
            hostFixture.detectChanges();
            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));
            dotIframeDialogComponent = dotIframeDialog.componentInstance;
        });

        describe('dot-iframe-dialog', () => {
            it('should have dot-iframe-dialog', () => {
                expect(dotIframeDialog).toBeTruthy();
            });

            it('should have set url to', () => {
                expect(dotIframeDialogComponent.url).toBe(
                    [
                        `/c/portal/layout`,
                        `?p_l_id=999`,
                        `&p_p_id=content`,
                        `&p_p_action=1`,
                        `&p_p_state=maximized`,
                        `&p_p_mode=view`,
                        `&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet`,
                        `&_content_cmd=edit&inode=123`
                    ].join('')
                );
            });

            it('should emit close', () => {
                spyOn(component.close, 'emit');

                dotIframeDialog.triggerEventHandler('close', {});
                expect(component.close.emit).toHaveBeenCalledTimes(1);
            });
        });

        it('should hide', () => {
            hostComponent.inode = null;
            hostFixture.detectChanges();
            dotIframeDialog = de.query(By.css('dot-iframe-dialog'));

            expect(dotIframeDialog === null).toBe(true);
        });
    });
});
