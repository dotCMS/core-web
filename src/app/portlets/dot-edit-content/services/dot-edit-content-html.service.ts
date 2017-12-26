import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EDIT_PAGE_CSS } from '../shared/iframe-edit-mode.css';
import { DotContainerContentletService } from './dot-container-contentlet.service';
import { DotDragDropAPIHtmlService } from './html/dot-drag-drop-api-html.service';
import { MODEL_VAR_NAME } from './html/iframe-edit-mode.js';
import { DotEditContentToolbarHtmlService } from './html/dot-edit-content-toolbar-html.service';

@Injectable()
export class DotEditContentHtmlService {
    contentletEvents: BehaviorSubject<any> = new BehaviorSubject({});
    iframe: ElementRef;
    model: BehaviorSubject<any> = new BehaviorSubject(null);

    private addContentContainer: string;

    constructor(
        private dotContainerContentletService: DotContainerContentletService,
        private dotDragDropAPIHtmlService: DotDragDropAPIHtmlService,
        private dotEditContentToolbarHtmlService: DotEditContentToolbarHtmlService
    ) {
        this.contentletEvents.subscribe(res => {
            if (res.event === 'save') {
                this.renderRelocatedContentlet({
                    contentlet: {
                        inode: 'e0e31ce27719' || res.data.inode
                    }
                });
            }

            if (res.event === 'select') {
                this.renderAddedContentlet({
                    identifier: res.data.identifier
                });
            }

            if (res.event === 'relocate') {
                this.renderRelocatedContentlet(res.data);
            }
        });
    }

    initEditMode(editPageHTML: string, iframeEl: ElementRef): void {
        this.iframe = iframeEl;
        this.loadCodeIntoIframe(editPageHTML);

        const iframeElement = this.getEditPageIframe();

        iframeElement.contentWindow[MODEL_VAR_NAME] = this.model;
        iframeElement.contentWindow.contentletEvents = this.contentletEvents;

        iframeElement.addEventListener('load', () => {
            this.setEditMode();
        });
    }

    removeContentlet(inode: string): void {
        const doc = this.getEditPageDocument();
        const contenletEl = doc.querySelector(`div[data-dot-inode="${inode}"]`);
        contenletEl.remove();
        this.model.next(this.getEditPageIframe().contentWindow.getModel());
    }

    renderAddedContentlet(contentlet: any): void {
        const doc = this.getEditPageDocument();
        const containerEl = doc.querySelector(
            `div[data-dot-object="container"][data-dot-identifier="${this.addContentContainer}"]`
        );
        const contentletEl = this.createNewContentlet(contentlet);

        containerEl.insertAdjacentElement('afterbegin', contentletEl);

        this.dotContainerContentletService
            .getContentletToContainer(this.addContentContainer, contentlet.identifier)
            .subscribe(contentletHtml => {
                const contentletContentEl = contentletEl.querySelector('.dotedit-contentlet__content');

                // Removing the loading indicator
                contentletContentEl.innerHTML = '';
                this.appendNewContentlets(contentletContentEl, contentletHtml);

                this.addContentContainer = null;

                // Update the model with the recently added contentlet
                this.model.next(this.getEditPageIframe().contentWindow.getModel());
            });
    }

    setContainterToAppendContentlet(identifier: string): void {
        this.addContentContainer = identifier;
    }

    private generateContentToolBars(): void {
        const doc = this.getEditPageDocument();
        this.dotEditContentToolbarHtmlService.addContainerToolbar(doc);
        this.dotEditContentToolbarHtmlService.addContentletMarkup(doc);

        this.bindContainersEvents();
        this.bindContenletsEvents();
    }

    private appendNewContentlets(contentletContentEl: any, renderedContentet: string): void {
        const doc = this.getEditPageDocument();

        // Add innerHTML to a plain so we can get the HTML nodes later
        const div = doc.createElement('div');
        div.innerHTML = renderedContentet;
        // TODO: need to come up with a more efficient way to do this
        Array.from(div.children).forEach((node: any) => {
            if (node.tagName === 'SCRIPT') {
                const script = doc.createElement('script');
                script.type = 'text/javascript';

                if (node.src) {
                    script.src = node.src;
                } else {
                    script.text = node.textContent;
                }

                contentletContentEl.appendChild(script);
            } else {
                contentletContentEl.appendChild(node);
            }
        });
    }

    private bindContenletsEvents(): void {
        this.bindEditContentletEvents();
        this.bindRemoveContentletEvents();
    }

    private bindButtonsEvent(button: any, type: string): void {
        button.addEventListener('click', $event => {
            this.contentletEvents.next({
                event: type,
                dataset: $event.target.dataset,
                contentletEvents: this.contentletEvents
            });
        });
    }

    private bindContainersEvents(): void {
        const addButtons = this.getEditPageDocument().querySelectorAll('.dotedit-container__add');
        Array.from(addButtons).forEach((button: any) => {
            const parent = button.parentElement;
            const menuItems = parent.querySelectorAll('.dotedit-container__menu-item a');

            button.addEventListener('click', $event => {
                this.closeContainersToolBarMenu(parent);
                parent.classList.toggle('active');
            });

            Array.from(menuItems).forEach(menuItem => {
                this.bindButtonsEvent(menuItem, 'add');
            });
        });
    }

    private bindWindowEvents(): void {
        const doc = this.getEditPageDocument();

        doc.addEventListener('click', $event => {
            if (!$event.currentTarget.activeElement.classList.contains('dotedit-container__add')) {
                this.closeContainersToolBarMenu();
            }
        });
    }

    private closeContainersToolBarMenu(activeElement?): void {
        const doc = this.getEditPageDocument();
        const activeToolBarMenus = doc.querySelectorAll('.dotedit-container__toolbar.active');
        Array.from(activeToolBarMenus).forEach((toolbar: any) => {
            if (activeElement !== toolbar) {
                toolbar.classList.remove('active');
            }
        });
    }

    private bindEditContentletEvents(): void {
        const editButtons = this.getEditPageDocument().querySelectorAll('.dotedit-contentlet__edit');
        Array.from(editButtons).forEach(button => {
            this.bindButtonsEvent(button, 'edit');
        });
    }

    private bindRemoveContentletEvents(): void {
        const editButtons = this.getEditPageDocument().querySelectorAll('.dotedit-contentlet__remove');
        Array.from(editButtons).forEach(button => {
            this.bindButtonsEvent(button, 'remove');
        });
    }

    private createNewContentlet(contentlet: any): any {
        const doc = this.getEditPageDocument();
        const dotEditContentletEl = doc.createElement('div');
        dotEditContentletEl.dataset.dotObject = 'contentlet';
        dotEditContentletEl.dataset.dotIdentifier = contentlet.identifier;
        dotEditContentletEl.dataset.dotInode = contentlet.inode;
        dotEditContentletEl.dataset.dotType = contentlet.type;

        dotEditContentletEl.innerHTML = `
            <div class="dotedit-contentlet__toolbar">
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${contentlet.inode}" class="dotedit-contentlet__drag">Drag</button>
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${contentlet.inode}" class="dotedit-contentlet__edit">Edit</button>
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${contentlet.inode}" class="dotedit-contentlet__remove">Remove</button>
            </div>
            <div class="dotedit-contentlet__content"><div class="loader__overlay"><div class="loader"></div></div></div>
        `;

        this.bindButtonsEvent(dotEditContentletEl.querySelector('.dotedit-contentlet__edit'), 'edit');
        this.bindButtonsEvent(dotEditContentletEl.querySelector('.dotedit-contentlet__remove'), 'remove');

        return dotEditContentletEl;
    }

    private getEditPageIframe(): any {
        return this.iframe.nativeElement;
    }

    private getEditPageDocument(): any {
        return this.getEditPageIframe().contentDocument || this.getEditPageIframe().contentWindow.document;
    }

    private loadCodeIntoIframe(editPageHTML: string): void {
        const doc = this.getEditPageDocument();
        doc.open();
        doc.write(editPageHTML);
        doc.close();
    }

    private setEditContentletStyles(): void {
        const doc = this.getEditPageDocument();
        const style = doc.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = EDIT_PAGE_CSS;
        } else {
            style.appendChild(document.createTextNode(EDIT_PAGE_CSS));
        }

        doc.head.appendChild(style);
    }

    private setEditMode(): void {
        this.generateContentToolBars();

        this.dotDragDropAPIHtmlService.initDragAndDropContext(this.getEditPageDocument());
        this.setEditContentletStyles();
        this.bindWindowEvents();
    }

    private renderRelocatedContentlet(relocateInfo: any): void {
        const doc = this.getEditPageDocument();
        const contenletEl = doc.querySelector(
            `div[data-dot-object="contentlet"][data-dot-inode="${relocateInfo.contentlet.inode}"]`
        );
        const contentletContentEl = contenletEl.querySelector('.dotedit-contentlet__content');

        contentletContentEl.innerHTML += '<div class="loader__overlay"><div class="loader"></div></div>';

        relocateInfo.container = relocateInfo.container || contenletEl.parentNode.dataset.dotIdentifier;

        this.dotContainerContentletService
            .getContentletToContainer(relocateInfo.container.identifier, relocateInfo.contentlet.identifier)
            .subscribe(contentletHtml => {
                // Removing the loading indicator
                contentletContentEl.innerHTML = '';
                this.appendNewContentlets(contentletContentEl, contentletHtml);
            });
    }
}
