import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';

/**
 * The DotIconButtonComponent is a round button which
 * reuses the dot-icon component
 * @export
 * @class DotIconButtonComponent
 */
@Component({
    selector: 'dot-icon-button',
    styleUrls: ['./dot-icon-button.component.scss'],

    template: `<div class="dot-icon-button
                {{ this.tiny ? 'tiny' : '' }}
                {{ this.disabled ? 'disabled' : '' }}"
                (click)='buttonOnClick($event)'>
                   <dot-icon name="{{ this.icon }}" tiny="{{ this.tiny }}"  invertColor="{{ this.invertColor }}"></dot-icon>
               </div>`
})
export class DotIconButtonComponent {

    @Input() disabled?: boolean;
    @Input() invertColor?: boolean;
    @Input() tiny?: boolean;
    @Input() icon: string;

    @Output() click: EventEmitter<any> = new EventEmitter();

    @HostListener('click', ['$event'])
    public onClick($event: any): void {
        $event.stopPropagation();
    }

    /**
     * Emits the click of the button
     *
     * @param {any} $event
     * @memberof DotIconButtonComponent
     */
    buttonOnClick($event): void {
        if (!this.disabled) {
            this.click.emit($event);
        }
    }
}
