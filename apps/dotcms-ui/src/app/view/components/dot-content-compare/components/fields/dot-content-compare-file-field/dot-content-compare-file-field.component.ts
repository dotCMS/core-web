import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dot-content-compare-file-field',
    templateUrl: './dot-content-compare-file-field.component.html',
    styleUrls: ['./dot-content-compare-file-field.component.scss']
})
export class DotContentCompareFileFieldComponent implements OnInit {
    @Input() fileURL: string;
    @Input() label: string;

    constructor() {}

    ngOnInit(): void {}
}
