import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SettingsStorageService} from 'dotcms-js/dotcms-js';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-browser',
    styles: [require('./dot-browser.scss')],
    templateUrl: 'dot-browser.html'
})

export class DotBrowserComponent implements OnInit {
    constructor(
        // private settingsStorageService: SettingsStorageService
    ) {}
    ngOnInit(): void {}
}
