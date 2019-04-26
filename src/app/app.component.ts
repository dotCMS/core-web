import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotLicensedService } from '@services/not-licensed-service';
import { DotcmsConfig } from 'dotcms-js';
import { DotUiColors, DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { take, pluck } from 'rxjs/operators';

// import { initDotCMS } from './../../projects/dotcms/src/public_api';

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
        // const dotcms = initDotCMS({
        //     token:
        //     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGlkYjUzYWJiOC0yOTExLTQ0MjMtYWE3OS02MmRlZjdhZTg4ODIiLCJ4bW9kIjoxNTU2MzA0MTE0MDAwLCJuYmYiOjE1NTYzMDQxMTQsImlzcyI6IjEwOWVjOTcwLWY3MGYtNDZiNi04NzY3LTNlNDk3ODU1N2E1YiIsImV4cCI6MTU1NzE2ODExNCwiaWF0IjoxNTU2MzA0MTE0LCJqdGkiOiI2Y2JkNDk0OS0wZmI4LTRiMzgtYTE5NC01ZTRmYzYxNTgxMzIifQ.63kJdQNHzeRj6MJ61X_OgaK-82kA6WSpcYQSEuBgDtw'
        // });

        // const form = dotcms.form.get({
        //     contentType: 'TestForm',
        //     identifier: '27768b2c-5dd2-4f7e-92e6-048d5ecd33bb'
        // });

        // form.render(this.div.nativeElement);

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
