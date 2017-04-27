import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-browser',
    styles: [require('./dot-browser.scss')],
    templateUrl: 'dot-browser.html'
})

export class DotBrowserComponent implements OnInit {
    constructor() {
        console.log('test');
    }
    ngOnInit(): void {
        console.log('EDITED AGAIN 3');
    }
}
