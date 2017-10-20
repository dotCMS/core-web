import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    // encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-browser',
    styleUrls: ['./dot-browser.scss'],
    templateUrl: 'dot-browser.html'
})

export class DotBrowserComponent implements OnInit {

    siteView = 'tree';

    constructor() {}
    ngOnInit(): void {}
    changeViewToTree(): void {
        this.siteView = 'tree';
    }
    changeViewToIcon(): void {
        this.siteView = 'icon';
    }
}
