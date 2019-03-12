import { Component, OnInit } from '@angular/core';
import { NotLicensedService } from '@services/not-licensed-service';
import { DotcmsConfig } from 'dotcms-js';
import { DotUiColors, DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { take, pluck } from 'rxjs/operators';

@Component({
    selector: 'dot-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    variables = [
        {
            clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
            fieldId: 'ec8cc36f-6058-4ab5-9bfb-fc36ab011ee5',
            id: 'fd39ccaa-ffbc-420f-9839-46eaad625f59',
            key: 'a1',
            value: 'asd1'
        },
        {
            clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
            fieldId: 'ec8cc36f-6058-4ab5-9bfb-fc36ab011ee5',
            id: 'fd39ccaa-ffbc-420f-9839-46eaad625f59',
            key: 'b2',
            value: 'bvc2'
        }
    ];

    labels = {
        value: 'Value',
        key: 'Key',
        actions: 'Actions',
        noRows: 'No Rows',
        cancel: 'Cancel',
        save: 'Save',
        keyPlaceholder: 'Enter key',
        valuePlaceholder: 'Enter value'
    };

    constructor(
        notLicensedService: NotLicensedService,
        private dotCmsConfig: DotcmsConfig,
        private dotUiColors: DotUiColorsService
    ) {
        notLicensedService.init();
    }

    ngOnInit() {
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

    output(e) {
        console.log('--emit', e);
    }
}
