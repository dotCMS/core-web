import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface DotAddContentLet {
    add: string;
    container: string;
}

@Component({
    selector: 'dot-add-contentlet',
    templateUrl: './dot-add-contentlet.component.html',
    styleUrls: ['./dot-add-contentlet.component.scss']
})
export class DotAddContentletComponent implements OnChanges {
    @Input() data: DotAddContentLet;
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    url: string;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        this.url = changes.data.currentValue
            ? `/html/ng-contentlet-selector.jsp?ng=true&container_id=${this.data.container}&add=${this.data.add}`
            : null;
    }

    /**
     * Handle close dialog event
     *
     * @memberof DotEditContentletComponent
     */
    onClose(): void {
        this.close.emit();
    }
}
