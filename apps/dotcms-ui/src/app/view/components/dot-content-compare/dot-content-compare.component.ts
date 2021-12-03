import { Component, Input, OnInit } from '@angular/core';
import { DotContentCompareStore } from '@components/dot-content-compare/store/dot-content-compare.store';

export interface DotContentCompareEvent {
    inode: string;
    identifier: string;
    language: string;
}

@Component({
    selector: 'dot-content-compare',
    templateUrl: './dot-content-compare.component.html',
    styleUrls: ['./dot-content-compare.component.scss'],
    providers: [DotContentCompareStore]
})
export class DotContentCompareComponent implements OnInit {
    @Input() set data(data: DotContentCompareEvent) {
        this.store.loadData(data);
    }

    constructor(private store: DotContentCompareStore) {}

    ngOnInit(): void {}
}
