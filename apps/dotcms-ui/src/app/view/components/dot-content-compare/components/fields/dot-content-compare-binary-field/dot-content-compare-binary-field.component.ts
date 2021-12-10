import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'dot-content-compare-binary-field',
    templateUrl: './dot-content-compare-binary-field.component.html',
    styleUrls: ['./dot-content-compare-binary-field.component.scss']
})
export class DotContentCompareBinaryFieldComponent implements OnChanges {
    constructor() {}

    @Input() fileURL: string;
    @Input() label: string;
    imageError = false;

    ngOnChanges(changes: SimpleChanges) {
        console.log('changes', changes);
        this.imageError = false;
    }

    handleError(): void {
        this.imageError = true;
    }
}
