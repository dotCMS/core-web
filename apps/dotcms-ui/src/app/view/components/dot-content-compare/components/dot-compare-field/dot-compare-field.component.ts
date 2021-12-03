import { Component, HostBinding, Input, OnInit } from '@angular/core';
import HtmlDiff from 'htmldiff-js';

@Component({
    selector: 'dot-compare-field',
    templateUrl: './dot-compare-field.component.html',
    styleUrls: ['./dot-compare-field.component.scss']
})
export class DotCompareFieldComponent implements OnInit {
    @Input() showDiff = true;
    @Input() set value(value: { old: string; new: string }) {
        this.innerHTML = this.showDiff ? HtmlDiff.execute(value.old, value.new) : value.new;
    }

    innerHTML = '';

    constructor() {}

    ngOnInit(): void {}
}
