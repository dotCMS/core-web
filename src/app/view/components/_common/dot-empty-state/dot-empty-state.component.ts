import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dot-empty-state',
    templateUrl: './dot-empty-state.component.html',
    styleUrls: ['./dot-empty-state.component.scss']
})
export class DotEmptyStateComponent implements OnInit {
    @Input() rows: number;
    @Input() colsTextWidth: number[];
    @Input() icon: string;
    @Input() title: string;
    @Input() content: string;
    @Input() buttonLabel: string;
    @Output() buttonClick = new EventEmitter<string>();

    columnWidth: string;
    checkBoxWidth: number = 3.5;

    constructor() {}

    ngOnInit(): void {
        this.columnWidth = `${(100 - this.checkBoxWidth) / this.colsTextWidth.length}%`; // 100% - width of checkbox = 96.5%, which is then divided by number of cols
    }

    numberOfRows(): number[] {
        return Array(this.rows).fill(0);
    }

    goToPortlet(event: string) {
        this.buttonClick.emit(event);
    }
}
