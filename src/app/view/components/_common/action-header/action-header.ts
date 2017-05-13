import {Component} from '@angular/core';

@Component({
    selector: 'action-header',
    styles: [require('./action-header.scss')],
    templateUrl: 'action-header.html'
})

export class ActionHeaderComponent {

    splitButtonItems = [];

    show = false;

    constructor() {

        // CLEAN <<<
        this.splitButtonItems = [
            {label: 'Update', icon: 'fa-refresh', command: () => {}},
            {label: 'Delete', icon: 'fa-close', command: () => {}},
            {label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
            {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}
        ];
        // CLEAN >>>
    }

    selected(): any {
        this.show = (this.show === false ? true : false);
    }

}