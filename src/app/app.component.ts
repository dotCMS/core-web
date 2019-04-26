import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotLicensedService } from '@services/not-licensed-service';
import { DotcmsConfig } from 'dotcms-js';
import { DotUiColors, DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { take, pluck } from 'rxjs/operators';

import { initDotCMS } from './../../projects/dotcms/src/public_api';

@Component({
    selector: 'dot-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('div') div: ElementRef;

    constructor(
        notLicensedService: NotLicensedService,
        private dotCmsConfig: DotcmsConfig,
        private dotUiColors: DotUiColorsService
    ) {
        notLicensedService.init();
    }

    ngOnInit() {
        const dotcms = initDotCMS({
            token:
                'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGkzYjFjMDhhZi1mMTE3LTQyNmYtYmJiOS05MGUyYzM4YjQ4YzYiLCJ4bW9kIjoxNTU2MjE0Nzc2MDAwLCJuYmYiOjE1NTYyMTQ3NzYsImlzcyI6IjUwNzMwZjhmLTlhOWItNGIyNS05ZDNlLTNkNTUwYjFiNGU3ZiIsImV4cCI6MTU1NzA3ODc3NiwiaWF0IjoxNTU2MjE0Nzc2LCJqdGkiOiJhOTdhZDEzYy1hMDE3LTQ4MGYtYmZlYS0yNzNkYzU2MzkwNzYifQ._4X8sUtnqJ819ur7z3VeiNlhrYhkEh8trkksvYMOzXE'
        });

        const form = dotcms.form.get({
            contentType: 'TestForm',
            identifier: 'e8a51516-f80d-468f-a38b-618ef2020eff'
        });

        form.render(this.div.nativeElement);

        this.dotCmsConfig
            .getConfig()
            .pipe(
                take(1),
                pluck('colors')
            )
            .subscribe((colors: DotUiColors) => {
                this.dotUiColors.setColors(document.querySelector('html'), colors);
            });
    }
}
