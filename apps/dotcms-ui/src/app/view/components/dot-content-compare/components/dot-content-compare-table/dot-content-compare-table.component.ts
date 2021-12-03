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
    @Input() versions: DotCMSContentlet[];

    displayOptions = [
        { label: 'Diff', value: 'diff' },
        { label: 'Plain', value: 'plain' }
    ];

    constructor() {}

    ngOnInit(): void {}
}
