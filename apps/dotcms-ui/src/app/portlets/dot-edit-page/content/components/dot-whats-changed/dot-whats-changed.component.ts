import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DotDiffPipe } from '@dotcms/app/view/pipes';
import { IframeComponent } from '@components/_common/iframe/iframe-component';
import { DotEditPageService } from '@services/dot-edit-page/dot-edit-page.service';
import { take } from 'rxjs/operators';
import { DotWhatChanged } from '@models/dot-what-changed/dot-what-changed.model';
import { DotDOMHtmlUtilService } from '@portlets/dot-edit-page/content/services/html/dot-dom-html-util.service';

@Component({
    selector: 'dot-whats-changed',
    templateUrl: './dot-whats-changed.component.html',
    styleUrls: ['./dot-whats-changed.component.scss']
})
export class DotWhatsChangedComponent implements OnInit, OnChanges {
    @Input()
    languageId: string;
    @Input()
    pageId: string;
    styles: HTMLStyleElement;

    @ViewChild('dotIframe', { static: false }) dotIframe: IframeComponent;

    private dotDiffPipe = new DotDiffPipe();
    whatsChanged: DotWhatChanged = { diff: true, renderLive: '', renderWorking: '' };

    constructor(
        private dotEditPageService: DotEditPageService,
        private dotDOMHtmlUtilService: DotDOMHtmlUtilService
    ) {}

    ngOnInit(): void {
        this.styles = this.dotDOMHtmlUtilService.createStyleElement(
            `del{text-decoration: line-through; background-color:#fdb8c0 } ins{ text-decoration: underline; background-color: #ddffdd}`
        );
    }

    ngOnChanges(): void {
        this.dotEditPageService
            .whatChange(this.pageId, this.languageId)
            .pipe(take(1))
            .subscribe((data) => {
                this.whatsChanged = data;
                if (this.whatsChanged.diff) {
                    const doc = this.getEditPageDocument();
                    doc.open();
                    doc.write(
                        this.updateHtml(
                            this.dotDiffPipe.transform(
                                this.whatsChanged.renderLive,
                                this.whatsChanged.renderWorking
                            )
                        )
                    );
                    doc.head.appendChild(this.styles);
                    doc.close();
                }
            });
    }

    private getEditPageDocument(): Document {
        return (
            this.dotIframe.iframeElement.nativeElement.contentDocument ||
            this.dotIframe.iframeElement.nativeElement.contentWindow.document
        );
    }

    private updateHtml(content: string): string {
        const fakeHtml = document.createElement('html');
        fakeHtml.innerHTML = content;
        return fakeHtml.innerHTML;
    }
}
