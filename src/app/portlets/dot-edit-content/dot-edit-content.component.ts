import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { EDIT_PAGE_CSS } from './iframe-edit-mode.css';
import { DotConfirmationService } from '../../api/services/dot-confirmation';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dot-edit-content',
    templateUrl: './dot-edit-content.component.html',
    styleUrls: ['./dot-edit-content.component.scss'],
})
export class DotEditContentComponent implements OnInit {
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('contentletActionsIframe') contentletActionsIframe: ElementRef;

    dialogTitle: string;
    contentletActionsUrl: SafeResourceUrl;
    contentletEvents: BehaviorSubject<any> = new BehaviorSubject({});
    model: BehaviorSubject<any> = new BehaviorSubject(null);
    source: any;

    private addContentContainer: string;

    constructor(
        private dotConfirmationService: DotConfirmationService,
        private dotContainerContentletService: DotContainerContentletService,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.route.data.pluck('editPageHTML').subscribe((editPageHTML: string) => {
            this.loadCodeIntoIframe(editPageHTML);
        });

        const iframeEl = this.getEditPageIframe();
        iframeEl.addEventListener('load', () => this.setEditMode());
        iframeEl.contentWindow.model = this.model;
        iframeEl.contentWindow.contentletEvents = this.contentletEvents;

        this.model.subscribe((res) => {
            this.ref.detectChanges();
        });

        this.contentletEvents.subscribe((res) => {
            this.dialogTitle = null;
            this.contentletActionsUrl = null;

            if (res.event === 'save') {
                this.renderRelocatedContentlet({
                    contentlet: {
                        inode: '5aef0c62' || res.contentletInode,
                    },
                });
            }

            if (res.event === 'add') {
                this.renderAddedContentlet({
                    inode: res.data.inode,
                    identifier: res.data.Identifier, // need to fix this name in the backend
                    type: 'need-type',
                });
            }

            if (res.event === 'relocate') {
                this.renderRelocatedContentlet(res.data);
            }

            /*
                I think because we are triggering the .next() from the jsp the Angular detect changes it's not
                happenning automatically, so I have to triggered manually so the changes propagates to the template
            */
            this.ref.detectChanges();
        });
    }

    onHide(): void {
        this.dialogTitle = null;
        this.contentletActionsUrl = null;
    }

    private addContainerToolbar(): void {
        const doc = this.getEditPageDocument();

        const containers = doc.querySelectorAll('div[data-dot-object="container"]');

        Array.from(containers).forEach((container: any) => {
            const containerToolbar = doc.createElement('div');
            containerToolbar.classList.add('dotedit-container__toolbar');
            containerToolbar.innerHTML = `
                <button type="button" data-dot-identifier="${
                    container.dataset.dotIdentifier
                }" class="dotedit-container__add">Add</button>
            `;
            container.parentNode.insertBefore(containerToolbar, container);
        });

        this.bindContainersEvents();
    }

    private addContentlet($event): void {
        this.addContentContainer = $event.target.dataset.dotIdentifier;
        this.loadDialogEditor($event.target.dataset.dotIdentifier, '/html/ng-contentlet-selector.html?ng=true');
    }

    private addContentletMarkup(): void {
        const doc = this.getEditPageDocument();

        const contentlets = doc.querySelectorAll('div[data-dot-object="contentlet"]');

        Array.from(contentlets).forEach((contentlet: any) => {
            const contentletToolbar = doc.createElement('div');
            contentletToolbar.classList.add('dotedit-contentlet__toolbar');
            contentletToolbar.innerHTML = `
                <button type="button" data-dot-identifier="${contentlet.dataset.dotIdentifier}" data-dot-inode="${
                contentlet.dataset.dotInode
            }" class="dotedit-contentlet__edit">Edit</button>
                <button type="button" data-dot-identifier="${contentlet.dataset.dotIdentifier}" data-dot-inode="${
                contentlet.dataset.dotInode
            }" class="dotedit-contentlet__remove">Remove</button>
                <button type="button" data-dot-identifier="${contentlet.dataset.dotIdentifier}" data-dot-inode="${
                contentlet.dataset.dotInode
            }" class="dotedit-contentlet__drag">Drag</button>
            `;

            const contentletContent = doc.createElement('div');
            contentletContent.classList.add('dotedit-contentlet__content');
            contentletContent.innerHTML = contentlet.innerHTML;
            contentlet.innerHTML = '';

            contentlet.insertAdjacentElement('afterbegin', contentletContent);
            contentlet.insertAdjacentElement('afterbegin', contentletToolbar);
        });

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

    private bindContainersEvents(): void {
        this.bindAddContentletEvents();
    }

    private bindAddContentletEvents(): void {
        const addButtons = this.getEditPageDocument().querySelectorAll('.dotedit-container__add');

        addButtons.forEach((button) => {
            button.addEventListener('click', ($event) => {
                this.addContentlet($event);
            });
        });
    }

    private bindContenletsEvents(): void {
        this.bindEditContentletEvents();
        this.bindRemoveContentletEvents();
    }

    private bindEditContentletEvents(): void {
        const editButtons = this.getEditPageDocument().querySelectorAll('.dotedit-contentlet__edit');

        editButtons.forEach((button) => {
            button.addEventListener('click', ($event) => {
                this.editContentlet($event);
            });
        });
    }

    private bindRemoveContentletEvents(): void {
        const editButtons = this.getEditPageDocument().querySelectorAll('.dotedit-contentlet__remove');

        editButtons.forEach((button) => {
            button.addEventListener('click', ($event) => {
                this.removeContentlet($event);
            });
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
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${
            contentlet.inode
        }" class="dotedit-contentlet__edit">Edit</button>
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${
            contentlet.inode
        }" class="dotedit-contentlet__remove">Remove</button>
                <button type="button" data-dot-identifier="${contentlet.identifier}" data-dot-inode="${
            contentlet.inode
        }" class="dotedit-contentlet__drag">Drag</button>
            </div>
            <div class="dotedit-contentlet__content"><div class="loader__overlay"><div class="loader"></div></div></div>
        `;

        dotEditContentletEl.querySelector('.dotedit-contentlet__edit').addEventListener('click', ($event) => {
            this.editContentlet($event);
        });

        dotEditContentletEl.querySelector('.dotedit-contentlet__remove').addEventListener('click', ($event) => {
            this.removeContentlet($event);
        });

        return dotEditContentletEl;
    }

    private editContentlet($event): void {
        // tslint:disable-next-line:max-line-length
        const url =
            '/c/portal/layout?p_l_id=71b8a1ca-37b6-4b6e-a43b-c7482f28db6c&p_p_id=content&p_p_action=1&p_p_state=maximized&p_p_mode=view&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet&_content_cmd=edit&inode=aaee9776-8fb7-4501-8048-844912a20405&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D71b8a1ca-37b6-4b6e-a43b-c7482f28db6c%26p_p_id%3Dcontent%26p_p_action%3D1%26p_p_state%3Dmaximized%26_content_struts_action%3D%2Fext%2Fcontentlet%2Fview_contentlets';

        this.loadDialogEditor($event.target.dataset.dotIdentifier, url);
    }

    private getDragAndDropCss(): any {
        const dragulaCss = this.getEditPageDocument().createElement('link');
        dragulaCss.rel = 'stylesheet';
        dragulaCss.type = 'text/css';
        dragulaCss.media = 'all';
        dragulaCss.href = '//bevacqua.github.io/dragula/dist/dragula.css';

        return dragulaCss;
    }

    private getDragAndDropScript(): any {
        const doc = this.getEditPageDocument();

        const script = doc.createElement('script');

        script.type = 'text/javascript';
        script.src = '//bevacqua.github.io/dragula/dist/dragula.js';
        script.onload = function() {
            const dragAndDropScript = doc.createElement('script');
            dragAndDropScript.type = 'text/javascript';
            dragAndDropScript.text = `
                var containers = Array.from(document.querySelectorAll('div[data-dot-object="container"]'));

                function getModel() {
                    var model = {};
                    containers.forEach(function(container) {
                        var contentlets = Array.from(container.querySelectorAll('div[data-dot-object="contentlet"]'));

                        model[container.dataset.dotIdentifier] = contentlets.map(function(contentlet) {
                            return contentlet.dataset.dotIdentifier
                        })
                    })

                    return model;
                }

                var forbiddenTarget;

                var drake = dragula(
                    containers, {
                    accepts: function (el, target, source, sibling) {
                        var canDrop = target.dataset.dotAcceptTypes.indexOf(el.dataset.dotType) > -1;

                        if (target.dataset.dotMaxLimit) {
                            var containerMaxLimit = parseInt(target.dataset.dotMaxLimit, 10);
                            var containerChildrenQuantity = target.children.length

                            canDrop = containerChildrenQuantity < containerMaxLimit;
                        }

                        if (!canDrop && target !== source) {
                            forbiddenTarget = target;
                            forbiddenTarget.classList.add('no')
                        }

                        return canDrop;
                    },
                    invalid: function(el, handle) {
                        return !handle.classList.contains('dotedit-contentlet__drag');
                    }
                });

                drake.on('dragend', function(el) {
                    if (forbiddenTarget && forbiddenTarget.classList.contains('no')) {
                        forbiddenTarget.classList.remove('no');
                    }

                    window.model.next(getModel());
                });

                drake.on('drop', function(el, target, source, sibling) {
                    if (target !== source) {
                        window.contentletEvents.next({
                            event: 'relocate',
                            data: {
                                container: {
                                    identifier: target.dataset.dotIdentifier,
                                    uuid: 'fake-one'
                                },
                                contentlet: {
                                    identifier: el.dataset.dotIdentifier,
                                    inode: el.dataset.dotInode
                                }
                            }
                        });
                    }
                })

                // Init the model
                window.model.next(getModel());
            `;
            doc.body.appendChild(dragAndDropScript);
        };

        return script;
    }

    private getEditPageDocument(): any {
        return this.getEditPageIframe().contentDocument || this.getEditPageIframe().contentWindow.document;
    }

    private getEditPageIframe(): any {
        return this.iframe.nativeElement;
    }

    private initDragAndDropContentlets(): void {
        const doc = this.getEditPageDocument();
        doc.head.appendChild(this.getDragAndDropCss());
        doc.body.appendChild(this.getDragAndDropScript());
    }

    private loadCodeIntoIframe(editPageHTML: string): void {
        const doc = this.getEditPageDocument();
        doc.open();
        doc.write(editPageHTML);
        doc.close();
    }

    private renderAddedContentlet(contentlet: any): void {
        const doc = this.getEditPageDocument();
        const containerEl = doc.querySelector(
            `div[data-dot-object="container"][data-dot-identifier="${this.addContentContainer}"]`,
        );
        const contentletEl = this.createNewContentlet(contentlet);

        containerEl.insertAdjacentElement('afterbegin', contentletEl);

        this.dotContainerContentletService
            .getContentletToContainer(this.addContentContainer, contentlet.contentlet)
            .subscribe((contentletHtml) => {
                const contentletContentEl = contentletEl.querySelector('.dotedit-contentlet__content');

                // Removing the loading indicator
                contentletContentEl.innerHTML = '';
                this.appendNewContentlets(contentletContentEl, contentletHtml);

                this.addContentContainer = null;

                // Update the model with the recently added contentlet
                this.model.next(this.getEditPageIframe().contentWindow.getModel());
            });
    }

    private renderRelocatedContentlet(relocateInfo: any): void {
        const doc = this.getEditPageDocument();

        const contenletEl = doc.querySelector(
            `div[data-dot-object="contentlet"][data-dot-inode="${relocateInfo.contentlet.inode}"]`,
        );

        const contentletContentEl = contenletEl.querySelector('.dotedit-contentlet__content');

        contentletContentEl.innerHTML += '<div class="loader__overlay"><div class="loader"></div></div>';

        relocateInfo.container = relocateInfo.container || contenletEl.parentNode.dataset.dotIdentifier;

        this.dotContainerContentletService
            .getContentletToContainer(relocateInfo.container.identifier, relocateInfo.contentlet.identifier)
            .subscribe((contentletHtml) => {
                // Removing the loading indicator
                contentletContentEl.innerHTML = '';
                this.appendNewContentlets(contentletContentEl, contentletHtml);
            });
    }

    private loadDialogEditor(containerId: string, url: string): void {
        this.dialogTitle = `Editing content with id ${containerId}`;
        this.contentletActionsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        /*
            Again, because the click event it's comming form the iframe, we need to trigger the detect changes manually.
        */
        this.ref.detectChanges();

        /*
            We have an ngIf in the <iframe> to prevent the jsp to load before the dialog shows, so we need to wait that
            element it's available in the DOM
        */
        setTimeout(() => {
            const editContentletIframeEl = this.contentletActionsIframe.nativeElement;

            /*
                TODO: should I remove this listener when when the dialog closes?
            */
            editContentletIframeEl.addEventListener('load', () => {
                editContentletIframeEl.contentWindow.ngEditContentletEvents = this.contentletEvents;
            });
        }, 0);
    }

    private removeContentlet($event): void {
        // TODO: dialog it's not showing until click in the overlay
        this.dotConfirmationService.confirm({
            accept: () => {
                const doc = this.getEditPageDocument();
                const contenletEl = doc.querySelector(`div[data-dot-inode="${$event.target.dataset.dotInode}"]`);
                contenletEl.remove();
                this.model.next(this.getEditPageIframe().contentWindow.getModel());
            },
            header: `Remove a content?`,
            message: `Are you sure you want to remove this contentlet from the page? this action can't be undone`,
            footerLabel: {
                acceptLabel: 'Yes',
                rejectLabel: 'No',
            },
        });
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
        this.addContainerToolbar();
        this.addContentletMarkup();

        this.initDragAndDropContentlets();
        this.setEditContentletStyles();
    }
}
