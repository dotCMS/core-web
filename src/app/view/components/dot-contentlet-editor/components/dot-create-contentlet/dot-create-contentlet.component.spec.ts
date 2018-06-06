import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';
import { DotContentletWrapperComponent } from '../dot-contentlet-wrapper/dot-contentlet-wrapper.component';
import { DotCreateContentletComponent } from './dot-create-contentlet.component';
import { DotIframeDialogModule } from '../../../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../../../test/login-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DotCreateContentletComponent', () => {
    let component: DotCreateContentletComponent;
    let de: DebugElement;
    let fixture: ComponentFixture<DotCreateContentletComponent>;
    let dotCreateContentletWrapper: DebugElement;
    let dotCreateContentletWrapperComponent: DotContentletWrapperComponent;
    let dotContentletEditorService: DotContentletEditorService;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotCreateContentletComponent, DotContentletWrapperComponent],
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
        fixture = DOTTestBed.createComponent(DotCreateContentletComponent);
        de = fixture.debugElement;
        component = de.componentInstance;
        dotContentletEditorService = de.injector.get(DotContentletEditorService);

        spyOn(component.close, 'emit');

        fixture.detectChanges();

        dotCreateContentletWrapper = de.query(By.css('dot-contentlet-wrapper'));
        dotCreateContentletWrapperComponent = dotCreateContentletWrapper.componentInstance;
    });

    describe('default', () => {
        it('should have dot-contentlet-wrapper', () => {
            expect(dotCreateContentletWrapper).toBeTruthy();
        });

        it('should emit close', () => {
            dotCreateContentletWrapper.triggerEventHandler('close', {});
            expect(component.close.emit).toHaveBeenCalledTimes(1);
        });

        it('should have url in null', () => {
            expect(dotCreateContentletWrapperComponent.url).toEqual(null);
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

            expect(dotCreateContentletWrapperComponent.url).toEqual('');
        });
    });
});
