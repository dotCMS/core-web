import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'action-button',
    styles: [require('./action-button.scss')],
    templateUrl: 'action-button.html'
})

export class ActionButtonComponent {
    @Input() options: any[];
    @Input() primaryAction: Function;
    @Input() multipleOptions: Boolean;

    ngOnInit(): void {
        if (this.options === null) {
            this.multipleOptions = false;
        } else {
            this.multipleOptions = true;
        }
    }

}