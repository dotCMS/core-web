import {Component, Inject, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';

// Custom Components
import {GlobalSearch} from '../global-search/global-search';
import {MainNavigation} from '../main-navigation/main-navigation';
import {ToolbarNotifications} from '../toolbar-notifications/toolbar-notifications';
import {DropdownComponent} from "../dropdown-component/dropdown-component";
import {ToolbarUserComponent} from "../toolbar-user/toolbar-user";


// Angular Material
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MdButton} from '@angular2-material/button/button';
import {MdIcon, MdAnchor} from '@angular2-material/icon/icon';
import { Router } from '@ngrx/router';
import {SiteSelectorComponent} from "../../site-selector/dot-site-selector-component";

@Component({
    directives: [ToolbarUserComponent, DropdownComponent, MdToolbar, MD_SIDENAV_DIRECTIVES, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES,
        MdButton, MdIcon, GlobalSearch, MainNavigation, ToolbarNotifications, SiteSelectorComponent],
    encapsulation: ViewEncapsulation.Emulated,
    moduleId: __moduleName, // REQUIRED to use relative path in styleUrls
    providers: [],
    selector: 'dot-main-component',
    styleUrls: ['main-component.css'],
    templateUrl: ['main-component.html'],
})
export class MainComponent {

    constructor() {
    }

    ngOnInit() {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';
    }

}
