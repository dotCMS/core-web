import { Component, OnInit } from '@angular/core';
import { NotLicensedService } from './api/services/not-licensed-service';
import { DotcmsConfig } from 'dotcms-js/dotcms-js';
import { DotUiColors, DotUiColorsService } from './api/services/dot-ui-colors/dot-ui-colors.service';

@Component({
    selector: 'dot-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(notLicensedService: NotLicensedService, private dotCmsConfig: DotcmsConfig, private dotUiColors: DotUiColorsService) {
        document.ondragover = document.ondrop = (ev) => {
            notLicensedService.init();
            ev.preventDefault();
        };
    }

    ngOnInit() {
        this.dotCmsConfig.getConfig().take(1).pluck('colors').subscribe((colors: DotUiColors) => {
            this.dotUiColors.setColors(colors);
        });
    }

}
