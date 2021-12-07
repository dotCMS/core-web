import { Component, Input, OnInit } from '@angular/core';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-content-compare-binary-field',
    templateUrl: './dot-content-compare-binary-field.component.html',
    styleUrls: ['./dot-content-compare-binary-field.component.scss']
})
export class DotContentCompareBinaryFieldComponent implements OnInit {
    constructor() {}

    @Input() content: DotCMSContentlet;

    ngOnInit(): void {}
}
