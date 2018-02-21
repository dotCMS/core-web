import { Component } from '@angular/core';
import { NotLicensedService } from './api/services/not-licensed-service';
import { DotDialogService } from './api/services/dot-dialog';

@Component({
    selector: 'dot-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(notLicensedService: NotLicensedService, public dotDialogService: DotDialogService) {
        document.ondragover = document.ondrop = (ev) => {
            notLicensedService.init();
            ev.preventDefault();
        };
    }
}
