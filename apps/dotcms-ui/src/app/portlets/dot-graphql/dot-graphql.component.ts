import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { renderPlaygroundPage } from 'graphql-playground-html';

@Component({
    selector: 'dot-dot-graphql',
    templateUrl: './dot-graphql.component.html',
    styleUrls: ['./dot-graphql.component.scss']
})
export class DotGraphqlComponent implements OnInit {
    @ViewChild('iframe', { static: true }) iframe: ElementRef<HTMLIFrameElement>;
    private API_URL = '/api/v1/graphql';

    constructor() {}

    ngOnInit(): void {
        this.writeDocument();
    }

    private writeDocument(): void {
        const doc = this.iframe.nativeElement.contentWindow.document;
        doc.open();
        doc.write(
            renderPlaygroundPage({
                endpoint: this.API_URL
            })
        );
        doc.close();
    }
}
