import { async } from '@angular/core/testing';
import { DotEditContentHtmlService, DotContentletAction } from './dot-edit-content-html.service';
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
import { mockDotLayout } from '../../../../../test/dot-rendered-page.mock';

describe('DotEditContentHtmlService', () => {
    let fakeDocument: Document;

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
            <div data-dot-object="container" data-dot-identifier="123" data-dot-uuid="456" data-dot-can-add="CONTENT">
                <div
                    data-dot-object="contentlet"
                    data-dot-identifier="456"
                    data-dot-inode="456"
                    data-dot-type="NewsWidgets"
                    data-dot-basetype="CONTENT">
                    <div class="large-column">
                        <div
                            data-dot-object="vtl-file"
                            data-dot-inode="345274e0-3bbb-41f1-912c-b398d5745b9a"
                            data-dot-url="/application/vtl/widgets/news/personalized-news-listing.vtl"
                            data-dot-can-read="true"
                            data-dot-can-edit="true">
                        </div>
                        <h3>This is a title</h3>
                        <p>this is a paragraph</p>
                        <div data-dot-object="edit-content"></div>
                    </div>
                </div>
            </div>

            <div data-dot-object="container" data-dot-identifier="321" data-dot-uuid="654" data-dot-can-add="CONTENT">
                <div
                    data-dot-object="contentlet"
                    data-dot-identifier="456"
                    data-dot-inode="456"
                    data-dot-type="NewsWidgets"
                    data-dot-basetype="CONTENT">
                    <div class="large-column">
                        <h3>This is a title</h3>
                        <p>this is a paragraph</p>
                        <p>this is other paragraph</p>
                        <p>this is another paragraph</p>
                    </div>
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

    beforeEach(async(() => {
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
        this.dotEditContentHtmlService = <DotEditContentHtmlService>this.injector.get(DotEditContentHtmlService);
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

        fakeDocument = fakeIframeEl.contentWindow.document;
    }));

    describe('document click', () => {
        it('should open sub menu', () => {
            const button: HTMLButtonElement = <HTMLButtonElement>fakeDocument.querySelector('[data-dot-object="popup-button"]');
            button.click();
            expect(button.nextElementSibling.classList.contains('active')).toBe(true);
        });

        it('should emit iframe action to add content', () => {
            this.dotEditContentHtmlService.iframeActions$.subscribe((res) => {
                expect(res).toEqual({
                    name: 'add',
                    container: null,
                    dataset: button.dataset
                });
            });
            const button: HTMLButtonElement = <HTMLButtonElement>fakeDocument.querySelector('[data-dot-object="popup-menu-item"]');
            button.click();
        });

        it('should emit iframe action to edit content', () => {
            this.dotEditContentHtmlService.iframeActions$.subscribe((res) => {
                expect(res).toEqual({
                    name: 'edit',
                    container: container.dataset,
                    dataset: button.dataset
                });
            });
            const button: HTMLButtonElement = <HTMLButtonElement>fakeDocument.querySelector('.dotedit-contentlet__edit');
            const container = <HTMLElement>button.closest('div[data-dot-object="container"]');
            button.click();
        });

        it('should emit iframe action to remove content', () => {
            this.dotEditContentHtmlService.iframeActions$.subscribe((res) => {
                expect(res).toEqual({
                    name: 'remove',
                    container: container.dataset,
                    dataset: button.dataset
                });
            });
            const button: HTMLButtonElement = <HTMLButtonElement>fakeDocument.querySelector('.dotedit-contentlet__remove');
            const container = <HTMLElement>button.closest('div[data-dot-object="container"]');
            button.click();
        });

        it('should emit iframe action to edit vtl', () => {
            this.dotEditContentHtmlService.iframeActions$.subscribe((res) => {
                expect(res).toEqual({
                    name: 'code',
                    container: container.dataset,
                    dataset: button.dataset
                });
            });
            const button: HTMLButtonElement = <HTMLButtonElement>fakeDocument.querySelector(
                '.dotedit-contentlet__toolbar [data-dot-object="popup-menu-item"]'
            );
            const container = <HTMLElement>button.closest('div[data-dot-object="container"]');
            button.click();

            expect(this.dotEditContentHtmlService.currentContentlet).toEqual({
                identifier: '456',
                inode: '456',
                type: 'NewsWidgets',
                baseType: 'CONTENT'
            });
        });
    });

    it('should set same height to containers', () => {
        const mockLayout = JSON.parse(JSON.stringify(mockDotLayout));
        mockLayout.body.rows = [
            {
                columns: [
                    {
                        containers: [
                            {
                                identifier: '123',
                                uuid: '456'
                            }
                        ],
                        leftOffset: 1,
                        width: 8
                    },
                    {
                        containers: [
                            {
                                identifier: '321',
                                uuid: '654'
                            }
                        ],
                        leftOffset: 1,
                        width: 8
                    }
                ]
            }
        ];

        const querySelector1 = [`div[data-dot-object="container"]`, `[data-dot-identifier="123"]`, `[data-dot-uuid="456"]`].join('');
        const querySelector2 = [`div[data-dot-object="container"]`, `[data-dot-identifier="321"]`, `[data-dot-uuid="654"]`].join('');

        this.dotEditContentHtmlService.setContaintersSameHeight(mockLayout);

        const firstContainer = this.dotEditContentHtmlService.getEditPageDocument().querySelector(querySelector1);
        const secondContainer = this.dotEditContentHtmlService.getEditPageDocument().querySelector(querySelector2);

        expect(firstContainer.offsetHeight).toEqual(secondContainer.offsetHeight);
    });

    it('should add contentlet', () => {
        spyOn(this.dotEditContentHtmlService, 'renderAddedContentlet');
        this.dotEditContentHtmlService.setContainterToAppendContentlet({
            identifier: '123',
            uuid: '456'
        });

        this.dotEditContentHtmlService.contentletEvents$.next({
            name: 'save',
            data: {
                identifier: '123'
            }
        });

        expect(this.dotEditContentHtmlService.renderAddedContentlet).toHaveBeenCalledWith({
            identifier: '123'
        });
    });

    it('should render edit contentlet', () => {
        this.dotEditContentHtmlService.setContainterToEditContentlet({
            identifier: '123',
            uuid: '456'
        });

        spyOn(this.dotEditContentHtmlService, 'renderEditedContentlet');

        this.dotEditContentHtmlService.contentletEvents$.next({
            name: 'save',
            data: {
                identifier: '456'
            }
        });

        expect(this.dotEditContentHtmlService.renderEditedContentlet).toHaveBeenCalledWith({
            identifier: '456'
        });
    });

    it('should render edit internal contentlet', () => {
        spyOn(this.dotEditContentHtmlService, 'renderEditedContentlet');

        this.dotEditContentHtmlService.currentContentlet = {
            identifier: '444',
            inode: '555'
        };

        this.dotEditContentHtmlService.contentletEvents$.next({
            name: 'save',
            data: {
                identifier: '456'
            }
        });

        expect(this.dotEditContentHtmlService.renderEditedContentlet).toHaveBeenCalledWith({
            identifier: '444',
            inode: '555'
        });
    });

    it('should handle edit-content from iframe click', () => {
        const editEl = fakeIframeEl.contentWindow.document.querySelector('[data-dot-object="edit-content"]');

        this.dotEditContentHtmlService.iframeActions$.subscribe((res) => {
            expect(JSON.parse(JSON.stringify(res))).toEqual({
                name: 'edit',
                dataset: {
                    dotObject: 'edit-content',
                    dotIdentifier: '456',
                    dotInode: '456'
                },
                container: {
                    dotCanAdd: 'CONTENT',
                    dotIdentifier: '123',
                    dotObject: 'container',
                    dotUuid: '456'
                }
            });
        });

        editEl.click();

        expect(this.dotEditContentHtmlService.currentContentlet).toEqual({
            identifier: '456',
            inode: '456',
            type: 'NewsWidgets',
            baseType: 'CONTENT'
        });
    });

    it('should render relocated contentlet', () => {
        spyOn(this.dotEditContentHtmlService, 'renderRelocatedContentlet');

        this.dotEditContentHtmlService.contentletEvents$.next({
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
        this.dotEditContentHtmlService.currentAction = DotContentletAction.ADD;

        const dotEditContentToolbarHtmlService = this.injector.get(DotContainerContentletService);
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(Observable.of('<i>testing</i>'));

        const contentlet: DotPageContent = {
            identifier: '67',
            inode: '89',
            type: 'type',
            baseType: 'CONTENT'
        };

        this.dotEditContentHtmlService.pageModel$.subscribe((model) => (currentModel = model));

        this.dotEditContentHtmlService.renderAddedContentlet(contentlet);

        expect(this.dotEditContentHtmlService.currentAction === DotContentletAction.EDIT).toBe(
            true,
            'update the action after content creation'
        );

        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(currentContainer, contentlet);

        expect(this.dotEditContentHtmlService.currentContainer).toEqual(
            {
                identifier: '123',
                uuid: '456'
            },
            'currentContainer must be the same after add content'
        );

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
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(Observable.of('<i>testing</i>'));

        const dotDialogService = this.injector.get(DotDialogService);
        spyOn(dotDialogService, 'alert');

        const contentlet: DotPageContent = {
            identifier: '456',
            inode: '456',
            type: 'type',
            baseType: 'CONTENT'
        };

        this.dotEditContentHtmlService.pageModel$.subscribe((model) => (currentModel = model));

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
        spyOn(dotEditContentToolbarHtmlService, 'getContentletToContainer').and.returnValue(Observable.of('<i>testing</i>'));

        this.dotEditContentHtmlService.renderEditedContentlet(contentlet);

        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(currentContainer, contentlet);
        expect(dotEditContentToolbarHtmlService.getContentletToContainer).toHaveBeenCalledWith(anotherContainer, contentlet);
    });
});
