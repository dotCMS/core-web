import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, ComponentFactoryResolver } from '@angular/core';

import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';
import { DotContentletWrapperComponent } from '../dot-contentlet-wrapper/dot-contentlet-wrapper.component';
import { DotEditContentletComponent } from './dot-edit-contentlet.component';
import { DotIframeDialogModule } from '../../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../../../test/login-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DotEditContentletComponent', () => {
    let component: DotEditContentletComponent;
    let de: DebugElement;
    let fixture: ComponentFixture<DotEditContentletComponent>;
    let dotEditContentletWrapper: DebugElement;
    let dotEditContentletWrapperComponent: DotContentletWrapperComponent;
    let dotContentletEditorService: DotContentletEditorService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotEditContentletComponent, DotContentletWrapperComponent],
            providers: [
                DotContentletEditorService,
                DotMenuService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ],
            imports: [DotIframeDialogModule, BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotEditContentletComponent);
        de = fixture.debugElement;
        component = de.componentInstance;
        dotContentletEditorService = de.injector.get(DotContentletEditorService);

        spyOn(component.close, 'emit');

        fixture.detectChanges();

        dotEditContentletWrapper = de.query(By.css('dot-contentlet-wrapper'));
        dotEditContentletWrapperComponent = dotEditContentletWrapper.componentInstance;
    });

    describe('default', () => {
        it('should have dot-contentlet-wrapper', () => {
            expect(dotEditContentletWrapper).toBeTruthy();
        });

        it('should emit close', () => {
            dotEditContentletWrapper.triggerEventHandler('close', {});
            expect(component.close.emit).toHaveBeenCalledTimes(1);
        });

        it('should have url in null', () => {
            expect(dotEditContentletWrapperComponent.url).toEqual(null);
        });

        xit('should set url', () => {
            dotContentletEditorService.edit({
                data: {
                    inode: '123'
                },
                events: {
                    load: jasmine.createSpy(),
                    keyDown: jasmine.createSpy()
                }
            });

            fixture.detectChanges();

            expect(dotEditContentletWrapperComponent.url).toEqual('');
        });
    });
});
