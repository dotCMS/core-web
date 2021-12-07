import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { DotContentCompareTableData } from '@components/dot-content-compare/store/dot-content-compare.store';

@Component({
    selector: 'dot-content-compare-table',
    templateUrl: './dot-content-compare-table.component.html',
    styleUrls: ['./dot-content-compare-table.component.scss']
})
export class DotContentCompareTableComponent implements OnInit {
    @Input() data: DotContentCompareTableData;
    @Input() showDiff: boolean;

    @Output() version = new EventEmitter<DotCMSContentlet>();
    @Output() diff = new EventEmitter<boolean>();

    displayOptions = [
        { label: 'Diff', value: true },
        { label: 'Plain', value: false }
    ];

    constructor() {}

    ngOnInit(): void {}
}
