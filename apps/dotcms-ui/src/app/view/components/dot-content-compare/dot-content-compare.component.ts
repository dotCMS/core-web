import { Component, OnInit } from '@angular/core';
import { DotContentCompareStore } from '@components/dot-content-compare/store/dot-content-compare.store';

@Component({
    selector: 'dot-content-compare',
    templateUrl: './dot-content-compare.component.html',
    styleUrls: ['./dot-content-compare.component.scss'],
    providers: [DotContentCompareStore]
})
export class DotContentCompareComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    show = true;

    close(): void {
        this.show = false;
    }
}
