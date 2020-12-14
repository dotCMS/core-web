import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dot-empty-state',
    templateUrl: './dot-empty-state.component.html',
    styleUrls: ['./dot-empty-state.component.scss']
})
export class DotEmptyStateComponent implements OnInit {
    @Input()
    rows: number;

    @Input()
    cols: number[];
    inputWidth: string;

    constructor() {}

    /**
     * Return rows for empty template
     * @param number n
     * @returns number[]
     * @memberof DotEmptyStateComponent
     */
    numberOfRows(): number[] {
        return Array(this.rows).fill(0);
    }

    ngOnInit(): void {
        this.inputWidth = `${96.5 / this.cols.length}%`; // 100% - width of checkbox = 96.5%, which is then divided by number of cols
    }
}
