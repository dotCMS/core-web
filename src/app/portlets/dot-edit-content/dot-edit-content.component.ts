import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FAKE_EDIT_PAGE_HTML } from './fake-edit-page-html';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'dot-edit-content',
    templateUrl: './dot-edit-content.component.html',
    styleUrls: ['./dot-edit-content.component.scss']
})
export class DotEditContentComponent implements OnInit {
    @ViewChild('iframe') iframe: ElementRef;
    source: any;
    dialogTitle: string;
    editContentUrl: any;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        const iframeEl = this.iframe.nativeElement;
        iframeEl.addEventListener('load', () => this.setEditMode(iframeEl));

        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(FAKE_EDIT_PAGE_HTML);
        doc.close();
    }

    onClick($event): void {
        this.dialogTitle = `Editing content with id ${$event.target.dataset.id}`;
        // tslint:disable-next-line:max-line-length
        this.editContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            '/c/portal/layout?p_l_id=71b8a1ca-37b6-4b6e-a43b-c7482f28db6c&p_p_id=content&p_p_action=1&p_p_state=maximized&p_p_mode=view&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet&_content_cmd=edit&inode=aaee9776-8fb7-4501-8048-844912a20405&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D71b8a1ca-37b6-4b6e-a43b-c7482f28db6c%26p_p_id%3Dcontent%26p_p_action%3D1%26p_p_state%3Dmaximized%26_content_struts_action%3D%2Fext%2Fcontentlet%2Fview_contentlets'
        );
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
                dragula([document.getElementById('test1'), document.getElementById('test2')]);
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
        button.dataset.id = editContent.getAttribute('data-id');
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
