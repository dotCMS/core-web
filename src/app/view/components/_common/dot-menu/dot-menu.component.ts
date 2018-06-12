import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'dot-menu',
    templateUrl: './dot-menu.component.html',
    styleUrls: ['./dot-menu.component.scss']
})
export class DotMenuComponent implements OnInit {
    @Input() icon: string;
    @Input() items: MenuItem[];
    visible = false;

    constructor() {}

    ngOnInit() {}

    toggle(): void {
        console.log('Inicio: '+this.visible);
        this.visible = !this.visible;
        if (this.visible) {
            console.log('visible');
            document.addEventListener('click', this.closemenu.bind(this)); // add handler
        }
    }

    closemenu($event) {
        const that = this;
        debugger;
        console.log('closemenu');

        this.toggle();
        //this.visible = false;
        console.log(this.visible);
       // document.removeEventListener('click', this.closemenu); // add handler
    }
}
