import { async, ComponentFixture } from '@angular/core/testing';
import { DotEditContentComponent } from './dot-edit-content.component';
import { DialogModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotEditPageToolbarModule } from './components/dot-edit-page-toolbar/dot-edit-page-toolbar.module';
import { DotConfirmationService } from '../../api/services/dot-confirmation/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DotEditContentHtmlService } from './services/dot-edit-content-html.service';
import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { MessageService } from '../../api/services/messages-service';
import { DOTTestBed } from '../../test/dot-test-bed';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../test/login-service.mock';
import { MockMessageService } from '../../test/message-service.mock';
import { DotDragDropAPIHtmlService } from './services/html/dot-drag-drop-api-html.service';
import { DotDOMHtmlUtilService } from './services/html/dot-dom-html-util.service';
import { DotEditContentToolbarHtmlService } from './services/html/dot-edit-content-toolbar-html.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('DotEditContentComponent', () => {
    let component: DotEditContentComponent;
    let fixture: ComponentFixture<DotEditContentComponent>;

    beforeEach(
        async(() => {
            const messageServiceMock = new MockMessageService({
                'editpage.toolbar.primary.action': 'Save',
                'editpage.toolbar.secondary.action': 'Cancel'
            });

            DOTTestBed.configureTestingModule({
                declarations: [DotEditContentComponent],
                imports: [DialogModule, BrowserAnimationsModule, DotEditPageToolbarModule],
                providers: [
                    DotConfirmationService,
                    DotContainerContentletService,
                    DotEditContentHtmlService,
                    { provide: LoginService, useClass: LoginServiceMock },
                    { provide: MessageService, useValue: messageServiceMock },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            data: Observable.of({ editPageHTML: '' })
                        }
                    },
                    DotDragDropAPIHtmlService,
                    DotDOMHtmlUtilService,
                    DotEditContentToolbarHtmlService
                ]
            });
        })
    );

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotEditContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should has a toolbar', () => {
        const de: DebugElement = fixture.debugElement.query(By.css('dot-edit-page-toolbar'));
        expect(de).not.toBeNull();
    });
});
