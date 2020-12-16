import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dot-empty-state',
    templateUrl: './dot-empty-state.component.html',
    styleUrls: ['./dot-empty-state.component.scss']
})
export class DotEmptyStateComponent implements OnInit {
    @Input() rows: number;
    @Input() colsTextWidth: number[] = [];
    @Input() icon: string;
    @Input() title: string;
    @Input() content: string;
    @Input() buttonLabel: string = 'Hello';
    @Output() buttonClick = new EventEmitter<string>();

    columnWidth: string;
    checkBoxWidth: number = 3.5;

    constructor() {}

    ngOnInit(): void {
        this.columnWidth = this.calculateColumnWidth();
    }

    numberOfRows(): number[] {
        return Array(this.rows).fill(0);
    }

    goToPortlet(event: string) {
        this.buttonClick.emit(event);
    }

    private calculateColumnWidth(): string {
        return `${(100 - this.checkBoxWidth) / this.colsTextWidth.length}%`;
    }
}
