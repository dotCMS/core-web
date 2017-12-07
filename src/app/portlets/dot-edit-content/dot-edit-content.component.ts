import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FAKE_EDIT_PAGE_HTML } from './fake-edit-page-html';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'dot-edit-content',
    templateUrl: './dot-edit-content.component.html',
    styleUrls: ['./dot-edit-content.component.scss']
})
export class DotEditContentComponent implements OnInit {
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('editContentIframe') editContentIframe: ElementRef;

    dialogTitle: string;
    editContentUrl: SafeResourceUrl;
    model: BehaviorSubject<any> = new BehaviorSubject(null);
    editContentlet: BehaviorSubject<any> = new BehaviorSubject({});
    source: any;

    constructor(private sanitizer: DomSanitizer, private ref: ChangeDetectorRef) {}

    ngOnInit() {
        const iframeEl = this.iframe.nativeElement;
        iframeEl.addEventListener('load', () => this.setEditMode(iframeEl));

        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(FAKE_EDIT_PAGE_HTML);
        doc.close();

        iframeEl.contentWindow.model = this.model;

        this.model.subscribe(res => {
            this.ref.detectChanges();
        });

        this.editContentlet.subscribe(res => {
            if (res === 'cancel') {
                this.dialogTitle = null;
                this.editContentUrl = null;
            }

            /*
                I think because we are triggering the .next() from the jsp the Angular detect changes it's not
                happenning automatically, so I have to triggered manually so the changes propagates to the template
            */
            this.ref.detectChanges();
        });
    }

    onClick($event): void {
        this.dialogTitle = `Editing content with id ${$event.target.dataset.identifier}`;
        this.editContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            // tslint:disable-next-line:max-line-length
            '/c/portal/layout?p_l_id=71b8a1ca-37b6-4b6e-a43b-c7482f28db6c&p_p_id=content&p_p_action=1&p_p_state=maximized&p_p_mode=view&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet&_content_cmd=edit&inode=aaee9776-8fb7-4501-8048-844912a20405&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D71b8a1ca-37b6-4b6e-a43b-c7482f28db6c%26p_p_id%3Dcontent%26p_p_action%3D1%26p_p_state%3Dmaximized%26_content_struts_action%3D%2Fext%2Fcontentlet%2Fview_contentlets'
        );

        /*
            We have an ngIf in the <iframe> to prevent the jsp to load before the dialog shows, so we need to wait that
            element it's available in the DOM
        */
        setTimeout(() => {
            const editContentletIframeEl = this.editContentIframe.nativeElement;
            editContentletIframeEl.addEventListener('load', () => {
                editContentletIframeEl.contentWindow.editContentlet = this.editContentlet;
            });
        }, 0);
    }

    onHide(): void {
        this.dialogTitle = null;
        this.editContentUrl = null;
    }

    private addEditButtons(iframeEl: any): void {
        const editContents: HTMLElement[] = iframeEl.contentDocument.getElementsByTagName('dotedit-contentlet');

        for (let i = 0; i < editContents.length; i++) {
            const editContent = editContents[i];
            editContent.insertAdjacentElement('afterbegin', this.getEditButton(editContent));
        }
    }

    private getDragAndDropCss(doc: any): any {
        const dragulaCss = doc.createElement('link');
        dragulaCss.rel = 'stylesheet';
        dragulaCss.type = 'text/css';
        dragulaCss.media = 'all';
        dragulaCss.href = '//bevacqua.github.io/dragula/dist/dragula.css';

        return dragulaCss;
    }

    private getDragAndDropScript(doc: any): any {
        const script = doc.createElement('script');

        script.type = 'text/javascript';
        script.src = '//bevacqua.github.io/dragula/dist/dragula.js';
        script.onload = function() {
            const dragAndDropScript = doc.createElement('script');
            dragAndDropScript.type = 'text/javascript';
            dragAndDropScript.text = `
                var containers = Array.from(document.getElementsByTagName('dotedit-container'));

                function getModel() {
                    var model = {};
                    containers.forEach(function(container) {
                        var contentlets = Array.from(container.children);

                        model[container.dataset.identifier] = contentlets.map(function(contentlet) {
                            return contentlet.dataset.identifier
                        })
                    })

                    return model;
                }

                var forbiddenTarget;

                var drake = dragula(
                    containers, {
                    accepts: function (el, target, source, sibling) {
                        var canDrop = target.dataset.acceptTypes.indexOf(el.dataset.type) > -1;

                        if (target.dataset.maxLimit) {
                            var containerMaxLimit = parseInt(target.dataset.maxLimit, 10);
                            var containerChildrenQuantity = target.children.length

                            canDrop = containerChildrenQuantity < containerMaxLimit;
                        }

                        if (!canDrop && target !== source) {
                            forbiddenTarget = target;
                            forbiddenTarget.classList.add('no')
                        }

                        return canDrop;
                    },
                });

                drake.on('dragend', function(el, container, source) {
                    if (forbiddenTarget && forbiddenTarget.classList.contains('no')) {
                        forbiddenTarget.classList.remove('no');
                    }

                    window.model.next(getModel());
                })

                window.model.next(getModel());
            `;
            doc.body.appendChild(dragAndDropScript);
        };

        return script;
    }

    private getEditButton(editContent: HTMLElement): HTMLButtonElement {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = 'Edit this';
        button.className = 'button-edit';
        button.dataset.identifier = editContent.getAttribute('data-identifier');
        button.addEventListener('click', $event => {
            this.onClick($event);
        });

        return button;
    }

    private initDragAndDropContentlets(doc: any): void {
        doc.head.appendChild(this.getDragAndDropCss(doc));
        doc.body.appendChild(this.getDragAndDropScript(doc));
    }

    private setEditMode(iframeEl: any): void {
        this.addEditButtons(iframeEl);

        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        this.initDragAndDropContentlets(doc);
        this.setEditContentletZones(doc);
    }

    private setEditContentletZones(doc: any): void {
        const style = doc.createElement('style');
        style.type = 'text/css';

        const css = `
            dotedit-container,
            dotedit-contentlet {
                display: block;
            }

            dotedit-container {
                border: solid 1px #f2f2f2;
                min-height: 100px;
                margin: 10px 0
            }

            dotedit-container.no {
                border-color: red;
                box-shadow: 0 0 20px red;
                border-radious: 2px;
                background-color: #ff00000f;
            }

            dotedit-container:hover {
                border-color: #dddddd;
            }

            dotedit-contentlet {
                padding: 10px;
            }

            dotedit-contentlet:hover {
                background-color: #f2f2f2;
                cursor: move
            }
        `;

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        doc.head.appendChild(style);
    }
}
