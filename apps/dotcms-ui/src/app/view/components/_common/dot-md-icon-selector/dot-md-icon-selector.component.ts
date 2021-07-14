import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dot-md-icon-selector',
    templateUrl: './dot-md-icon-selector.component.html',
    styleUrls: ['./dot-md-icon-selector.component.scss']
})
export class DotMdIconSelectorComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    onChange(e) {
        console.log(e);
    }

}
