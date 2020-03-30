import { Component, OnInit, ViewChild } from '@angular/core';
import { DotApps, DotAppsSaveData } from '@shared/models/dot-apps/dot-apps.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';

import { AppsResolverData } from '../dot-apps-configuration/dot-apps-configuration-resolver.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';

@Component({
    selector: 'dot-apps-configuration-detail',
    templateUrl: './dot-apps-configuration-detail.component.html',
    styleUrls: ['./dot-apps-configuration-detail.component.scss']
})
export class DotAppsConfigurationDetailComponent implements OnInit {
    @ViewChild('searchInput')
    messagesKey: { [key: string]: string } = {};
    apps: DotApps;

    formData: { [key: string]: string };
    formFields: any[];
    formValid: boolean;

    constructor(
        private route: ActivatedRoute,
        private dotRouterService: DotRouterService,
        private dotAppsService: DotAppsService
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('data'), take(1))
            .subscribe(({ messages, app }: AppsResolverData) => {
                this.apps = app;
                this.formFields = app.sites[0].secrets;
                this.messagesKey = messages;
            });

        // const group = {};
        // this.formFields.forEach((field) => {
        //     group[field.name] = new FormControl(
        //         field.value || '',
        //         field.required ? Validators.required : null
        //     );
        // });
        // this.myFormGroup = new FormGroup(group);
        // this.myFormGroup.valueChanges.subscribe((val) => {
        //     console.log('change', val);
        // });
    }

    onSubmit() {
        this.dotAppsService
            .saveSiteConfiguration(
                this.apps.key,
                this.apps.sites[0].id,
                this.getTransformedFormData()
            )
            .subscribe();
    }

    setFormData(form: { [key: string]: string }): void {
        this.formData = form;
    }

    /**
     * Redirects to app configuration listing page
     *
     * @param string key
     * @memberof DotAppsListComponent
     */
    goToApps(key: string): void {
        this.dotRouterService.gotoPortlet(`/apps/${key}`);
    }

    private getTransformedFormData(): DotAppsSaveData {
        const params = {};
        for (const key of Object.keys(this.formData)) {
            params[key] = {
                hidden: this.formData[`${key}Hidden`] || false,
                value: this.formData[key]
            };
        }
        return params;
    }
}
