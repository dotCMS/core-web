import { Component, Input } from '@angular/core';

@Component({
    selector: 'action-header',
    styles: [require('./action-header.scss')],
    templateUrl: 'action-header.html'
})

export class ActionHeaderComponent {

    public dynamicOverflow = 'visible';

    @Input() selected = false;
    @Input() selectedItems = [];
    @Input() actionButtonItems = [];
    @Input() primaryCommand;

    constructor() {

    }

    ngOnChanges(): any {
        this.dynamicOverflow = 'hidden';
        setTimeout(() => {
            this.dynamicOverflow = 'visible';
        }, 1000);
    }
}