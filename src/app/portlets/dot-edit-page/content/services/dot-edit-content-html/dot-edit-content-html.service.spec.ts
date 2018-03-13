import { fakeAsync, tick } from '@angular/core/testing';
import { DotEditContentHtmlService } from './dot-edit-content-html.service';
import { DotEditContentToolbarHtmlService } from '../html/dot-edit-content-toolbar-html.service';
import { DotContainerContentletService } from '../dot-container-contentlet.service';
import { DotDragDropAPIHtmlService } from '../html/dot-drag-drop-api-html.service';
import { DotDOMHtmlUtilService } from '../html/dot-dom-html-util.service';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { LoggerService, StringUtils } from 'dotcms-js/dotcms-js';
import { Config } from 'dotcms-js/core/config.service';
import { Logger } from 'angular2-logger/core';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotDialogService } from '../../../../../api/services/dot-dialog/dot-dialog.service';
import { DotPageContent } from '../../../../dot-edit-page/shared/models/dot-page-content.model';
import { Observable } from 'rxjs/Observable';

describe('DotEditContentHtmlService', () => {
    const fakeHTML = `
        <html>
        <head>
            <script>
                function getDotNgModel() {
                    return 'testing';
                }
            </script>
        </head>
        <body>
            <div data-dot-object="container" data-dot-identifier="123" data-dot-uuid="456">
                <div data-dot-object="contentlet" data-dot-identifier="456" data-dot-inode="456">
                    <div class="large-column"></div>
                </div>
            </div>

            <div data-dot-object="container" data-dot-identifier="321" data-dot-uuid="654">
                <div data-dot-object="contentlet" data-dot-identifier="456" data-dot-inode="456">
                    <div class="large-column"></div>
                </div>
            </div>
        </body>
        </html>
    `;
    let fakeIframeEl;

    const messageServiceMock = new MockDotMessageService({
        'editpage.content.contentlet.menu.drag': 'Drag',
        'editpage.content.contentlet.menu.edit': 'Edit',
        'editpage.content.contentlet.menu.remove': 'Remove',
        'editpage.content.container.action.add': 'Add',
        'editpage.content.container.menu.content': 'Content',
        'editpage.content.container.menu.widget': 'Widget',
        'editpage.content.container.menu.form': 'Form'
    });

    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([
            DotEditContentHtmlService,
            DotContainerContentletService,
            DotEditContentToolbarHtmlService,
            DotDragDropAPIHtmlService,
            DotDOMHtmlUtilService,
            LoggerService,
            Config,
            Logger,
            StringUtils,
            DotDialogService,
            { provide: DotMessageService, useValue: messageServiceMock }
        ]);
        this.dotEditContentHtmlService = this.injector.get(DotEditContentHtmlService);
        this.dotEditContentToolbarHtmlService = this.injector.get(DotEditContentToolbarHtmlService);

        fakeIframeEl = document.createElement('iframe');
        document.body.appendChild(fakeIframeEl);
        fakeIframeEl.contentWindow.document.open();
        fakeIframeEl.contentWindow.document.write('');
        fakeIframeEl.contentWindow.document.close();
        /*
            TODO: in the refactor we need to make this service just to generate and return stuff, pass the iframe
            is not a good architecture.
        */
        this.dotEditContentHtmlService.initEditMode(fakeHTML, { nativeElement: fakeIframeEl });
    });

    it(
        'should bind containers events when the html is done',
        fakeAsync((): void => {
            spyOn(this.dotEditContentHtmlService, 'bindContainersEvents');

            this.dotEditContentToolbarHtmlService.addContainerToolbar(fakeIframeEl.contentDocument).then(() => {
                this.dotEditContentHtmlService.bindContainersEvents();
            });

            tick();
            expect(this.dotEditContentHtmlService.bindContainersEvents).toHaveBeenCalledTimes(1);
        })
    );

    it(
        'should bind contentlets events when the html is done',
        fakeAsync((): void => {
            spyOn(this.dotEditContentHtmlService, 'bindContenletsEvents');

            this.dotEditContentToolbarHtmlService.addContainerToolbar(fakeIframeEl.contentDocument).then(() => {
                this.dotEditContentHtmlService.bindContenletsEvents();
            });

            tick();
            expect(this.dotEditContentHtmlService.bindContenletsEvents).toHaveBeenCalledTimes(1);
        })
    );

    it('should add contentlet', () => {
        spyOn(this.dotEditContentHtmlService, 'renderAddedContentlet');
        this.dotEditContentHtmlService.setContainterToAppendContentlet({
            identifier: '123',
            uuid: '456'
        });

        this.dotEditContentHtmlService.contentletEvents.next({
            name: 'save',
            data: {
                identifier: '123'
            }
        });

        expect(this.dotEditContentHtmlService.renderAddedContentlet).toHaveBeenCalledWith({
            identifier: '123'
        });
    });

    it('should edit contentlet', () => {
        this.dotEditContentHtmlService.setContainterToEditContentlet({
            identifier: '123',
            uuid: '456'
        });

        spyOn(this.dotEditContentHtmlService, 'renderEditedContentlet');

        this.dotEditContentHtmlService.contentletEvents.next({
            name: 'save',
            data: {
                identifier: '456'
            }
        });

        expect(this.dotEditContentHtmlService.renderEditedContentlet).toHaveBeenCalledWith({
            identifier: '456'
        });
    });

    it('should relocate contentlet', () => {
        spyOn(this.dotEditContentHtmlService, 'renderRelocatedContentlet');

        this.dotEditContentHtmlService.contentletEvents.next({
            name: 'relocate',
            data: {
                identifier: '456'
            }
        });

        expect(this.dotEditContentHtmlService.renderRelocatedContentlet).toHaveBeenCalledWith({
            identifier: '456'
        });
    });

    it('should render added contentlet', () => {
        let currentModel;
        const currentContainer = {
            identifier: '123',
            uuid: '456'
        };

        this.dotEditContentHtmlService.currentContainer = currentContainer;

        const dotEditContentToolbarHtmlService = this.injector.get(DotContainerContentletService);
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(
            Observable.of('<i>testing</i>')
        );

        const contentlet: DotPageContent = {
            identifier: '67',
            inode: '89',
            type: 'type',
            baseType: 'CONTENT'
        };

        this.dotEditContentHtmlService.pageModelChange.subscribe((model) => (currentModel = model));

        this.dotEditContentHtmlService.renderAddedContentlet(contentlet);

        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(
            currentContainer,
            contentlet
        );

        expect(this.dotEditContentHtmlService.currentContainer).toBeNull('currentContainer must be null');
        expect(currentModel).toEqual('testing', 'should tigger model change event');
    });

    it('should show error message when the content already exists', () => {
        let currentModel = null;
        const currentContainer = {
            identifier: '123',
            uuid: '456'
        };

        this.dotEditContentHtmlService.currentContainer = currentContainer;

        const dotEditContentToolbarHtmlService = this.injector.get(DotContainerContentletService);
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(
            Observable.of('<i>testing</i>')
        );

        const dotDialogService = this.injector.get(DotDialogService);
        spyOn(dotDialogService, 'alert');

        const contentlet: DotPageContent = {
            identifier: '456',
            inode: '456',
            type: 'type',
            baseType: 'CONTENT'
        };

        this.dotEditContentHtmlService.pageModelChange.subscribe((model) => (currentModel = model));

        this.dotEditContentHtmlService.renderAddedContentlet(contentlet);

        expect(dotEditContentToolbarHtmlService.getContentletToContainer).not.toHaveBeenCalled();
        expect(this.dotEditContentHtmlService.currentContainer).toBeNull('The current container must be null');
        expect(currentModel).toBeNull('should not tigger model change event');
        expect(dotDialogService.alert).toHaveBeenCalled();
    });

    it('should render edit contentlet', () => {
        const currentContainer = {
            identifier: '123',
            uuid: '456'
        };

        const anotherContainer = {
            identifier: '321',
            uuid: '654'
        };

        this.dotEditContentHtmlService.currentContainer = currentContainer;
        const contentlet: DotPageContent = {
            identifier: '456',
            inode: '456',
            type: 'type',
            baseType: 'CONTENT'
        };

        const dotEditContentToolbarHtmlService = this.injector.get(DotContainerContentletService);
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(
            Observable.of('<i>testing</i>')
        );

        this.dotEditContentHtmlService.renderEditedContentlet(contentlet);

        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(
            currentContainer,
            contentlet
        );
        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(
            anotherContainer,
            contentlet
        );
    });
});
