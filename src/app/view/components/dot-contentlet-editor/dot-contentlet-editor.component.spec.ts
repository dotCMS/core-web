/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DotContentletEditorComponent } from './dot-contentlet-editor.component';
import { DotAddContentletComponent } from './components/dot-add-contentlet/dot-add-contentlet.component';
import { DotEditContentletComponent } from './components/dot-edit-contentlet/dot-edit-contentlet.component';
import { DotCreateContentletComponent } from './components/dot-create-contentlet/dot-create-contentlet.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotIframeDialogModule } from '../dot-iframe-dialog/dot-iframe-dialog.module';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { DotContentletWrapperComponent } from './components/dot-contentlet-wrapper/dot-contentlet-wrapper.component';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../test/login-service.mock';

describe('DotContentletEditorComponent', () => {
    let component: DotContentletEditorComponent;
    let fixture: ComponentFixture<DotContentletEditorComponent>;
    let de: DebugElement;
    let add: DebugElement;
    let edit: DebugElement;
    let create: DebugElement;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DotIframeDialogModule, BrowserAnimationsModule],
            providers: [DotMenuService, {
                provide: LoginService,
                useClass: LoginServiceMock
            }],
            declarations: [
                DotContentletEditorComponent,
                DotAddContentletComponent,
                DotEditContentletComponent,
                DotCreateContentletComponent,
                DotContentletWrapperComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotContentletEditorComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
        add = de.query(By.css('dot-add-contentlet'));
        edit = de.query(By.css('dot-edit-contentlet'));
        create = de.query(By.css('dot-create-contentlet'));
        spyOn(component.close, 'emit');
    });

    it('should have add contentlet', () => {
        expect(add).toBeTruthy();
    });

    it('should have edit contentlet', () => {
        expect(edit).toBeTruthy();
    });

    it('should have create contentlet', () => {
        expect(create).toBeTruthy();
    });

    it('should emit close', () => {
        add.triggerEventHandler('close', {});
        edit.triggerEventHandler('close', {});
        create.triggerEventHandler('close', {});

        expect(component.close.emit).toHaveBeenCalledTimes(3);
    });
});
