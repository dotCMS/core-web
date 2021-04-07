import { fromEvent, of, Observable, Subject, Subscription } from 'rxjs';

import { map, take } from 'rxjs/operators';
import { Injectable, ElementRef, NgZone } from '@angular/core';

import * as _ from 'lodash';

import { DotContainerContentletService } from '../dot-container-contentlet.service';
import { DotDOMHtmlUtilService } from '../html/dot-dom-html-util.service';
import { DotAlertConfirmService } from '@services/dot-alert-confirm/dot-alert-confirm.service';
import { DotDragDropAPIHtmlService } from '../html/dot-drag-drop-api-html.service';
import { DotEditContentToolbarHtmlService } from '../html/dot-edit-content-toolbar-html.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotPageContent, DotPageRenderState } from '@portlets/dot-edit-page/shared/models';
import { DotGlobalMessageService } from '@components/_common/dot-global-message/dot-global-message.service';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';
import { getEditPageCss } from '../html/libraries/iframe-edit-mode.css';
import {
    GOOGLE_FONTS,
    MODEL_VAR_NAME
} from '@dotcms/app/portlets/dot-edit-page/content/services/html/libraries/iframe-edit-mode.js';
import { DotCMSContentType } from '@dotcms/dotcms-models';
import { PageModelChangeEvent, PageModelChangeEventType } from './models';
import {
    DotContentletEventRelocate,
    DotContentletEventSave,
    DotContentletEventSelect,
    DotRelocatePayload
} from './models/dot-contentlets-events.model';
import { DotPageContainer } from '@models/dot-page-container/dot-page-container.model';
import { DotLicenseService } from '@services/dot-license/dot-license.service';

export enum DotContentletAction {
    EDIT,
    ADD
}

interface DotPageContentExtra {
    innerHTML: string;
    dataset: { mode: string; inode: string; fieldName: string; language: string };
    element?: HTMLElement;
    isNotDirty?: boolean;
    eventType?: string;
}
@Injectable()
export class DotEditContentHtmlService {
    contentletEvents$: Subject<
        DotContentletEventRelocate | DotContentletEventSelect | DotContentletEventSave
    > = new Subject();
    currentContainer: DotPageContainer;
    currentContentlet: DotPageContent;
    iframe: ElementRef;
    iframeActions$: Subject<any> = new Subject();
    pageModel$: Subject<PageModelChangeEvent> = new Subject();
    mutationConfig = { attributes: false, childList: true, characterData: false };
    datasetMissing: string[];

    private inlineContentIsNotDirty = true;
    private inlineCurrentContent: { [key: string]: string }[] = [];
    private inlineContent: string;
    private currentAction: DotContentletAction;
    private docClickSubscription: Subscription;
    private updateContentletInode = false;
    private remoteRendered: boolean;

    private readonly docClickHandlers;

    constructor(
        private dotContainerContentletService: DotContainerContentletService,
        private dotDragDropAPIHtmlService: DotDragDropAPIHtmlService,
        private dotEditContentToolbarHtmlService: DotEditContentToolbarHtmlService,
        private dotDOMHtmlUtilService: DotDOMHtmlUtilService,
        private dotDialogService: DotAlertConfirmService,
        private dotMessageService: DotMessageService,
        private dotGlobalMessageService: DotGlobalMessageService,
        private dotWorkflowActionsFireService: DotWorkflowActionsFireService,
        private ngZone: NgZone,
        private dotLicenseService: DotLicenseService
    ) {
        this.contentletEvents$.subscribe(
            (
                contentletEvent:
                    | DotContentletEventRelocate
                    | DotContentletEventSelect
                    | DotContentletEventSave
            ) => {
                this.ngZone.run(() => {
                    this.handlerContentletEvents(contentletEvent.name)(contentletEvent.data);
                });
            }
        );

        if (!this.docClickHandlers) {
            this.docClickHandlers = {};
            this.setGlobalClickHandlers();
        }
    }

    /**
     * Load code into iframe
     *
     * @param string editPageHTML
     * @param ElementRef iframeEl
     * @returns Promise<boolean>
     * @memberof DotEditContentHtmlService
     */
    renderPage(pageState: DotPageRenderState, iframeEl: ElementRef): Promise<boolean> {
        this.remoteRendered = pageState.page.remoteRendered;

        return new Promise((resolve, _reject) => {
            this.iframe = iframeEl;
            const iframeElement = this.getEditPageIframe();

            iframeElement.addEventListener('load', () => {
                iframeElement.contentWindow[MODEL_VAR_NAME] = this.pageModel$;
                iframeElement.contentWindow['contentletEvents'] = this.contentletEvents$;

                this.bindGlobalEvents();

                resolve(true);
            });

            // Load content after bind 'load' event.
            this.loadCodeIntoIframe(pageState);
        });
    }

    /**
     * Initalize edit content mode
     *
     * @param string editPageHTML
     * @param ElementRef iframeEl
     * @memberof DotEditContentHtmlService
     */
    initEditMode(pageState: DotPageRenderState, iframeEl: ElementRef): void {
        this.renderPage(pageState, iframeEl).then(() => {
            this.setEditMode();
        });
    }

    /**
     * Remove a contentlet from the DOM by inode and update the page model
     *
     * @param string inode
     * @memberof DotEditContentHtmlService
     */
    removeContentlet(container: DotPageContainer, content: DotPageContent): void {
        const doc = this.getEditPageDocument();

        const selector = [
            `[data-dot-object="container"][data-dot-identifier="${container.identifier}"][data-dot-uuid="${container.uuid}"] `,
            `[data-dot-object="contentlet"][data-dot-inode="${content.inode}"]`
        ].join('');

        const contenletEl = doc.querySelector(selector);

        contenletEl.remove();

        this.pageModel$.next({
            model: this.getContentModel(),
            type: PageModelChangeEventType.REMOVE_CONTENT
        });
        this.updateContainerToolbar(container.identifier);
    }

    /**
     * Render contentlet in the DOM after edition.
     *
     * @param * contentlet
     * @memberof DotEditContentHtmlService
     */
    renderEditedContentlet(contentlet: DotPageContent): void {
        if (this.remoteRendered || !contentlet) {
            this.iframeActions$.next({
                name: 'save'
            });
        } else {
            const doc = this.getEditPageDocument();
            const currentContentlets: HTMLElement[] = Array.from(
                doc.querySelectorAll(
                    `[data-dot-object="contentlet"][data-dot-identifier="${contentlet.identifier}"]`
                )
            );
            currentContentlets.forEach((currentContentlet: HTMLElement) => {
                contentlet.type = currentContentlet.dataset.dotType;
                const containerEl = <HTMLElement>currentContentlet.parentNode;

                const container: DotPageContainer = {
                    identifier: containerEl.dataset.dotIdentifier,
                    uuid: containerEl.dataset.dotUuid
                };

                this.dotContainerContentletService
                    .getContentletToContainer(container, contentlet)
                    .pipe(take(1))
                    .subscribe((contentletHtml: string) => {
                        const contentletEl: HTMLElement = this.generateNewContentlet(
                            contentletHtml
                        );
                        containerEl.replaceChild(contentletEl, currentContentlet);
                    });
            });
        }
    }

    /**
     * Render a contrentlet in the DOM after add it
     *
     * @param * contentlet
     * @memberof DotEditContentHtmlService
     */
    renderAddedContentlet(contentlet: DotPageContent): void {
        const doc = this.getEditPageDocument();
        const containerEl: HTMLElement = doc.querySelector(
            `[data-dot-object="container"][data-dot-identifier="${this.currentContainer.identifier}"][data-dot-uuid="${this.currentContainer.uuid}"]`
        );

        if (this.isContentExistInContainer(contentlet, containerEl)) {
            this.showContentAlreadyAddedError();
        } else {
            const contentletPlaceholder = this.getContentletPlaceholder();
            containerEl.appendChild(contentletPlaceholder);
            this.dotContainerContentletService
                .getContentletToContainer(this.currentContainer, contentlet)
                .pipe(take(1))
                .subscribe((contentletHtml: string) => {
                    const contentletEl: HTMLElement = this.generateNewContentlet(contentletHtml);
                    containerEl.replaceChild(contentletEl, contentletPlaceholder);

                    // Update the model with the recently added contentlet
                    this.pageModel$.next({
                        model: this.getContentModel(),
                        type: PageModelChangeEventType.ADD_CONTENT
                    });
                    this.currentAction = DotContentletAction.EDIT;
                    this.updateContainerToolbar(containerEl.dataset.dotIdentifier);
                });
        }
    }

    /**
     * Render a form in the DOM after add it
     *
     * @param ContentType form
     * @memberof DotEditContentHtmlService
     */
    renderAddedForm(form: DotCMSContentType): Observable<DotPageContainer[]> {
        const doc = this.getEditPageDocument();
        const containerEl: HTMLElement = doc.querySelector(
            [
                '[data-dot-object="container"]',
                `[data-dot-identifier="${this.currentContainer.identifier}"]`,
                `[data-dot-uuid="${this.currentContainer.uuid}"]`
            ].join('')
        );

        if (this.isFormExistInContainer(form, containerEl)) {
            this.showContentAlreadyAddedError();
            return of(null);
        } else {
            const contentletPlaceholder = this.getContentletPlaceholder();
            containerEl.appendChild(contentletPlaceholder);
            return this.dotContainerContentletService
                .getFormToContainer(this.currentContainer, form)
                .pipe(
                    map(({ content }: { [key: string]: any }) => {
                        const { identifier, inode } = content;

                        containerEl.replaceChild(
                            this.renderFormContentlet(identifier, inode),
                            contentletPlaceholder
                        );
                        return this.getContentModel();
                    })
                );
        }
    }

    /**
     * Set the container id where a contentlet will be added
     *
     * @param string identifier
     * @memberof DotEditContentHtmlService
     */
    setContainterToAppendContentlet(pageContainer: DotPageContainer): void {
        this.currentContainer = pageContainer;
        this.currentAction = DotContentletAction.ADD;
    }

    /**
     * Return the page model
     *
     * @returns *
     * @memberof DotEditContentHtmlService
     */
    getContentModel(): DotPageContainer[] {
        return this.getEditPageIframe().contentWindow['getDotNgModel']();
    }

    private updateContainerToolbar(dotIdentifier: string) {
        const doc = this.getEditPageDocument();
        const target = <HTMLElement>(
            doc.querySelector(
                `[data-dot-object="container"][data-dot-identifier="${dotIdentifier}"]`
            )
        );
        this.dotEditContentToolbarHtmlService.updateContainerToolbar(target);
    }

    private getContentletPlaceholder(): HTMLDivElement {
        const doc = this.getEditPageDocument();
        const placeholder = doc.createElement('div');
        placeholder.setAttribute('data-dot-object', 'contentlet');
        placeholder.appendChild(this.getLoadingIndicator());
        return placeholder;
    }

    private renderFormContentlet(identifier: string, inode: string): HTMLElement {
        return this.createEmptyContentletElement({
            identifier,
            inode,
            baseType: 'FORM',
            type: 'forms'
        });
    }

    private bindGlobalEvents(): void {
        const doc = this.getEditPageDocument();

        if (this.docClickSubscription) {
            this.docClickSubscription.unsubscribe();
        }

        this.docClickSubscription = fromEvent(doc, 'click').subscribe(($event: MouseEvent) => {
            const target = <HTMLElement>$event.target;
            const method = this.docClickHandlers[target.dataset.dotObject];
            if (method) {
                method(target);
            }

            if (!target.classList.contains('dotedit-menu__button')) {
                this.closeContainersToolBarMenu();
            }
        });
    }

    private getCurrentContentlet(target: HTMLElement): DotPageContent {
        try {
            const contentlet = <HTMLElement>target.closest('[data-dot-object="contentlet"]');
            return {
                identifier: contentlet.dataset.dotIdentifier,
                inode: contentlet.dataset.dotInode,
                type: contentlet.dataset.dotType,
                baseType: contentlet.dataset.dotBasetype
            };
        } catch {
            return null;
        }
    }

    private setGlobalClickHandlers(): void {
        this.docClickHandlers['edit-content'] = (target: HTMLElement) => {
            this.currentContentlet = this.getCurrentContentlet(target);
            this.buttonClickHandler(target, 'edit');
        };

        this.docClickHandlers['remove-content'] = (target: HTMLElement) => {
            this.buttonClickHandler(target, 'remove');
        };

        this.docClickHandlers['popup-button'] = (target: HTMLElement) => {
            target.nextElementSibling.classList.toggle('active');
        };

        this.docClickHandlers['popup-menu-item'] = (target: HTMLElement) => {
            if (target.dataset.dotAction === 'code') {
                this.currentContentlet = this.getCurrentContentlet(target);
            }

            this.buttonClickHandler(target, target.dataset.dotAction);
        };
    }

    private showContentAlreadyAddedError(): void {
        this.currentContainer = null;
        this.dotDialogService.alert({
            header: this.dotMessageService.get('editpage.content.add.already.title'),
            message: this.dotMessageService.get('editpage.content.add.already.message'),
            footerLabel: {
                accept: 'Ok'
            }
        });
    }

    private isContentExistInContainer(
        contentlet: DotPageContent,
        containerEL: HTMLElement
    ): boolean {
        const contentsSelector = `[data-dot-object="contentlet"]`;
        const currentContentlets: HTMLElement[] = <HTMLElement[]>(
            Array.from(containerEL.querySelectorAll(contentsSelector).values())
        );
        return currentContentlets.some(
            (contentElement) => contentElement.dataset.dotIdentifier === contentlet.identifier
        );
    }

    private isFormExistInContainer(form: DotCMSContentType, containerEL: HTMLElement): boolean {
        const contentsSelector = `[data-dot-object="contentlet"]`;
        const currentContentlets: HTMLElement[] = <HTMLElement[]>(
            Array.from(containerEL.querySelectorAll(contentsSelector).values())
        );

        return currentContentlets.some(
            (contentElement) => contentElement.dataset.dotContentTypeId === form.id
        );
    }

    private addContentToolBars(): void {
        const doc = this.getEditPageDocument();
        this.dotEditContentToolbarHtmlService.bindContentletEvents(doc);
        this.dotEditContentToolbarHtmlService.addContainerToolbar(doc);
    }

    private injectInlineEditingScripts(): void {
        const doc = this.getEditPageDocument();
        const TINYMCE = `/html/js/tinymce/js/tinymce/tinymce.min.js`;
        const tinyMceScript: HTMLScriptElement = this.dotDOMHtmlUtilService.creatExternalScriptElement(
            TINYMCE
        );

        this.initInlineEditing();
        doc.body.append(tinyMceScript);
    }

    private initInlineEditing(): void {
        const doc = this.getEditPageDocument();
        const script = `
            function handleTinyMCEEvents(editor) {

                editor.on('change', ({ type: eventType }) => {
                    window.contentletEvents.next({
                        name: "tinyMceEvents",
                        data: {
                            eventType,
                            isNotDirty: editor.isNotDirty
                        },
                    });
                })

                editor.on("focus blur", (e) => {
                    
                    const { target: ed, type: eventType } = e

                    const content = ed.getContent();
                    const dataset = ed.targetElm.dataset;
                    const element = ed.targetElm;

                    // Fixes the pointerEvents issue
                    if(eventType === "focus" && dataset.mode === "full") {
                        ed.bodyElement.classList.add('active')
                    }


                    if(eventType === "blur" && ed.bodyElement.classList.contains('active')) {
                        ed.bodyElement.classList.remove('active')
                    }
                    
                    if(eventType === "blur") {
                        e.stopImmediatePropagation();
                        ed.destroy(false);
                    }

                    window.contentletEvents.next({
                        name: "tinyMceEvents",
                        data: {
                            dataset,
                            innerHTML: content,
                            element,
                            eventType
                        },
                    });
                });
            }

            const defaultConfig = {
                menubar: false,
                inline: true,
                valid_styles: {
                    "*": "font-size,font-family,color,text-decoration,text-align",
                },
                powerpaste_word_import: "clean",
                powerpaste_html_import: "clean",
                setup: (editor) => handleTinyMCEEvents(editor),
                
            }

            const tinyMCEConfig = {
            minimal: {
                plugins: ["link"],
                toolbar: "bold italic underline | link",
                valid_elements: "strong,em,span[style],a[href]",
                content_css: ["//fonts.googleapis.com/css?family=Lato:300,300i,400,400i"],
                ...defaultConfig,
            },
            full: {
                plugins: ["link", "lists", "autolink", "hr", "charmap"],
                style_formats: [
                { title: "Paragraph", format: "p" },
                { title: "Header 1", format: "h1" },
                { title: "Header 2", format: "h2" },
                { title: "Header 3", format: "h3" },
                { title: "Header 4", format: "h4" },
                { title: "Header 5", format: "h5" },
                { title: "Header 6", format: "h6" },
                { title: "Pre", format: "pre" },
                { title: "Code", format: "code" },
                ],
                toolbar: [
                    "styleselect | undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent | hr charmap removeformat | link",
                ],
                ...defaultConfig,
            },
            };

            document.addEventListener('click', function({ target: { dataset } }) {
                const dataSelector = '[data-inode="' + dataset.inode + '"][data-field-name="' + dataset.fieldName + '"]'
                // if the mode is truthy we initialize tinymce
                if(dataset.mode) {
                    tinymce.init({
                        ...tinyMCEConfig[dataset.mode],
                        selector: dataSelector
                    }).then(([ed]) => {
                        ed.editorCommands.execCommand('mceFocus')
                    });
                }
            });
        `;

        const tinyMceInit: HTMLScriptElement = this.dotDOMHtmlUtilService.createInlineScriptElement(
            script
        );

        this.dotLicenseService
            .isEnterprise()
            .pipe(take(1))
            .subscribe((isEnterprise) => {
                if (isEnterprise) {
                    doc.body.append(tinyMceInit);
                    const editModeNode = doc.querySelectorAll('[data-mode]');
                    editModeNode.forEach((node) => {
                        node.classList.add('edit-mode');
                    });
                }
            });
    }

    private createScriptTag(node: HTMLScriptElement): HTMLScriptElement {
        const doc = this.getEditPageDocument();
        const script = doc.createElement('script');
        script.type = 'text/javascript';

        if (node.src) {
            script.src = node.src;
        } else {
            script.text = node.textContent;
        }
        return script;
    }

    private getScriptTags(
        scriptTags: HTMLScriptElement[],
        contentlet: HTMLElement
    ): HTMLScriptElement[] {
        Array.from(contentlet.children).forEach((node: HTMLElement) => {
            if (node.tagName === 'SCRIPT') {
                const script = this.createScriptTag(<HTMLScriptElement>node);
                scriptTags.push(script);
                node.parentElement.removeChild(node);
            } else if (node.children.length) {
                this.getScriptTags(scriptTags, node);
            }
        });

        return scriptTags;
    }

    private getContentletElementFromHtml(html: string): HTMLElement {
        const doc = this.getEditPageDocument();
        // Add innerHTML to a plain so we can get the HTML nodes later
        const div = doc.createElement('div');
        div.innerHTML = html;

        return <HTMLElement>div.children[0];
    }

    private generateNewContentlet(html: string): HTMLElement {
        const newContentlet = this.getContentletElementFromHtml(html);

        let scriptTags: HTMLScriptElement[] = [];
        scriptTags = this.getScriptTags(scriptTags, newContentlet);

        scriptTags.forEach((script: HTMLScriptElement) => {
            newContentlet.appendChild(script);
        });

        return newContentlet;
    }

    private buttonClickHandler(target: HTMLElement, type: string) {
        this.updateContentletInode = this.shouldUpdateContentletInode(target);

        const container = <HTMLElement>target.closest('[data-dot-object="container"]');

        this.iframeActions$.next({
            name: type,
            dataset: target.dataset,
            container: container ? container.dataset : null
        });
    }

    private closeContainersToolBarMenu(activeElement?: Node): void {
        const doc = this.getEditPageDocument();
        const activeToolBarMenus = Array.from(doc.querySelectorAll('.dotedit-menu__list.active'));
        activeToolBarMenus.forEach((toolbar: HTMLElement) => {
            if (activeElement !== toolbar) {
                toolbar.classList.remove('active');
            }
        });
    }

    private createEmptyContentletElement(dotPageContent: DotPageContent): HTMLElement {
        const doc = this.getEditPageDocument();

        const dotEditContentletEl: HTMLElement = doc.createElement('div');
        dotEditContentletEl.setAttribute('data-dot-object', 'contentlet');

        for (const attr in dotPageContent) {
            if (dotPageContent.hasOwnProperty(attr)) {
                dotEditContentletEl.setAttribute(`data-dot-${attr}`, dotPageContent[attr]);
            }
        }

        return dotEditContentletEl;
    }

    private getEditPageIframe(): HTMLIFrameElement {
        return this.iframe.nativeElement;
    }

    private getEditPageDocument(): Document {
        return (
            this.getEditPageIframe().contentDocument ||
            this.getEditPageIframe().contentWindow.document
        );
    }

    private resetInlineCurrentContent(content) {
        return this.inlineCurrentContent.filter((element) => {
            const currentElementKey = Object.keys(element)[0];
            return currentElementKey !== content.element.id;
        });
    }

    private handleDatasetMissingErrors = (content) => {
        const requiredDatasetKeys = ['mode', 'inode', 'fieldName', 'language'];
        const datasetMissing = requiredDatasetKeys.filter(function (key) {
            return !Object.keys(content.dataset).includes(key);
        });
        const message = this.dotMessageService.get('editpage.inline.attribute.error');
        datasetMissing.forEach((dataset) => {
            this.dotGlobalMessageService.error(`${dataset} ${message}`);
        });
    };

    private handleTinyMCEOnFocusEvent(content: DotPageContentExtra) {
        this.handleDatasetMissingErrors(content);
        this.inlineCurrentContent = [
            ...this.inlineCurrentContent,
            {
                [content.element.id]: content.element.innerHTML
            }
        ];
    }

    private handleTinyMCEOnBlurEvent(content: DotPageContentExtra) {
        // If editor is dirty then we continue making the request
        if (!this.inlineContentIsNotDirty) {
            // We need to filter here to make sure innerHTML returns to its original content on error
            const [elementFilteredFromNodesObject] = this.inlineCurrentContent.filter((element) => {
                const currentElementKey = Object.keys(element)[0];
                return currentElementKey === content.element?.id;
            });

            // Add the loading indicator to the field
            content.element.classList.add('inline-editing--saving');

            const contentTypeNode: HTMLElement = content.element.closest(
                '[data-dot-object="contentlet"]'
            );

            const contentTypeName: string = contentTypeNode.dataset.dotType;

            // All good, initiate the request
            this.dotWorkflowActionsFireService
                .saveContentlet(contentTypeName, {
                    [content.dataset.fieldName]: content.innerHTML,
                    inode: content.dataset.inode
                })
                .subscribe(
                    () => {
                        // on success
                        content.element.classList.remove('inline-editing--saving');
                        this.inlineCurrentContent = this.resetInlineCurrentContent(content);
                        this.inlineContentIsNotDirty = true;
                    },
                    () => {
                        // on error
                        content.element.classList.remove('inline-editing--saving');
                        content.element.innerHTML =
                            elementFilteredFromNodesObject[content.element.id];
                        this.inlineCurrentContent = this.resetInlineCurrentContent(content);
                        const message = this.dotMessageService.get('editpage.inline.error');
                        this.dotGlobalMessageService.error(message);
                        this.inlineContentIsNotDirty = true;
                    }
                );
        } else {
            // No changes, reset back the array
            this.inlineCurrentContent = this.resetInlineCurrentContent(content);
        }
    }

    private handlerContentletEvents(
        event: string
    ): (contentletEvent: DotPageContent | DotRelocatePayload) => void {
        const contentletEventsMap = {
            // When an user create or edit a contentlet from the jsp
            save: (contentlet: DotPageContent) => {
                if (this.currentAction === DotContentletAction.ADD) {
                    this.renderAddedContentlet(contentlet);
                } else {
                    if (this.updateContentletInode) {
                        this.currentContentlet.inode = contentlet.inode;
                    }
                    this.renderEditedContentlet(this.currentContentlet);
                }
            },
            tinyMceEvents: (content: DotPageContent & DotPageContentExtra) => {
                if (content.eventType === 'change') {
                    if (typeof content.isNotDirty !== 'undefined') {
                        this.inlineContentIsNotDirty = content.isNotDirty;
                    }
                }
                if (content.eventType === 'focus') {
                    this.handleTinyMCEOnFocusEvent(content);
                }

                if (content.eventType === 'blur') {
                    this.handleTinyMCEOnBlurEvent(content);
                }
            },
            // When a user select a content from the search jsp
            select: (contentlet: DotPageContent) => {
                this.renderAddedContentlet(contentlet);
                this.iframeActions$.next({
                    name: 'select'
                });
            },
            // When a user drag and drop a contentlet in the iframe
            relocate: (relocateInfo: DotRelocatePayload) => {
                if (!this.remoteRendered) {
                    this.renderRelocatedContentlet(relocateInfo);
                }
            },
            'deleted-contenlet': () => {
                this.removeCurrentContentlet();
            }
        };

        return contentletEventsMap[event];
    }

    private shouldUpdateContentletInode(target: HTMLElement) {
        return target.dataset.dotObject === 'edit-content' && target.tagName === 'BUTTON';
    }

    private updateHtml(pageState: DotPageRenderState): string {
        const fakeHtml = document.createElement('html');
        fakeHtml.innerHTML = pageState.html;

        const head = fakeHtml.querySelector('head');

        if (fakeHtml.querySelector('base')) {
            return pageState.html;
        } else {
            const base = this.getBaseTag(pageState.page.pageURI);
            head.appendChild(base);
        }

        return fakeHtml.innerHTML;
    }

    private getBaseTag(url: string): HTMLBaseElement {
        const base = document.createElement('base');
        const href = url.split('/');
        href.pop();

        base.href = href.join('/') + '/';

        return base;
    }

    private loadCodeIntoIframe(pageState: DotPageRenderState): void {
        const doc = this.getEditPageDocument();
        const html = this.updateHtml(pageState);

        doc.open();
        doc.write(html);
        doc.close();
    }

    private setEditContentletStyles(): void {
        const timeStampId = `iframeId_${Math.floor(Date.now() / 100).toString()}`;
        const style = this.dotDOMHtmlUtilService.createStyleElement(
            getEditPageCss(`#${timeStampId}`)
        );
        const robotoFontElement = this.dotDOMHtmlUtilService.createLinkElement(GOOGLE_FONTS);

        const doc = this.getEditPageDocument();
        doc.documentElement.id = timeStampId;
        doc.head.appendChild(style);
        doc.head.appendChild(robotoFontElement);
    }

    private setEditMode(): void {
        this.setEditContentletStyles();
        this.addContentToolBars();
        this.injectInlineEditingScripts();
        this.dotDragDropAPIHtmlService.initDragAndDropContext(this.getEditPageIframe());
    }

    private removeCurrentContentlet(): void {
        const doc = this.getEditPageDocument();
        const contentlets = doc.querySelectorAll(
            `[data-dot-object="contentlet"][data-dot-inode="${this.currentContentlet.inode}"]`
        );

        contentlets.forEach((contentlet) => {
            contentlet.remove();
        });
    }

    private renderRelocatedContentlet(relocateInfo: DotRelocatePayload): void {
        const doc = this.getEditPageDocument();
        const contenletEl: HTMLElement = doc.querySelector(
            `[data-dot-object="contentlet"][data-dot-inode="${relocateInfo.contentlet.inode}"]`
        );
        contenletEl.insertAdjacentElement('afterbegin', this.getLoadingIndicator());

        const container: HTMLElement = <HTMLElement>contenletEl.parentNode;

        relocateInfo.container = relocateInfo.container || {
            identifier: container.dataset.dotIdentifier,
            uuid: container.dataset.dotUuid
        };

        this.dotContainerContentletService
            .getContentletToContainer(relocateInfo.container, relocateInfo.contentlet)
            .subscribe((contentletHtml: string) => {
                const newContentletEl: HTMLElement = this.generateNewContentlet(contentletHtml);
                container.replaceChild(newContentletEl, contenletEl);
            });
    }

    private getLoadingIndicator(): HTMLElement {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="loader__overlay">
                <div class="loader"></div>
            </div>
        `;

        return <HTMLElement>div.children[0];
    }
}
