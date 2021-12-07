import { Component, Input, OnInit } from '@angular/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-content-compare-file-field',
    templateUrl: './dot-content-compare-file-field.component.html',
    styleUrls: ['./dot-content-compare-file-field.component.scss']
})
export class DotContentCompareFileFieldComponent implements OnInit {
    @Input() content: DotCMSContentlet;

    constructor() {}

    ngOnInit(): void {}
}
