import { Component, Input, OnInit } from '@angular/core';
import { DotCMSContentlet, DotCMSContentTypeField } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-content-compare-table',
    templateUrl: './dot-content-compare-table.component.html',
    styleUrls: ['./dot-content-compare-table.component.scss']
})
export class DotContentCompareTableComponent implements OnInit {
    @Input() original: DotCMSContentlet;
    @Input() compare: DotCMSContentlet;
    @Input() fields: DotCMSContentTypeField[];

    constructor() {}

    ngOnInit(): void {}
}
