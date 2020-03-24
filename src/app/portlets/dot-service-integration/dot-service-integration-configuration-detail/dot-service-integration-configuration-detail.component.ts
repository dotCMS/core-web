import { Component, OnInit, ViewChild } from '@angular/core';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';

import { IntegrationResolverData } from '../dot-service-integration-configuration/dot-service-integration-configuration-resolver.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';

@Component({
    selector: 'dot-service-integration-configuration-detail',
    templateUrl: './dot-service-integration-configuration-detail.component.html',
    styleUrls: ['./dot-service-integration-configuration-detail.component.scss']
})
export class DotServiceIntegrationConfigurationDetailComponent implements OnInit {
    @ViewChild('searchInput')
    messagesKey: { [key: string]: string } = {};
    serviceIntegration: DotServiceIntegration;

    formFields: any[];
    myFormGroup: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private dotRouterService: DotRouterService,
        private dotServiceIntegrationService: DotServiceIntegrationService
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('data'), take(1))
            .subscribe(({ messages, service }: IntegrationResolverData) => {
                this.serviceIntegration = service;
                this.formFields = service.sites[0].secrets;
                this.messagesKey = messages;
            });

        const group = {};
        this.formFields.forEach((field) => {
            group[field.name] = new FormControl(
                field.value || '',
                field.required ? Validators.required : null
            );
        });
        this.myFormGroup = new FormGroup(group);
        this.myFormGroup.valueChanges.subscribe((val) => {
            console.log('change', val);
        });
    }

    onSubmit() {
        this.dotServiceIntegrationService
            .saveSiteConfiguration(
                this.serviceIntegration.key,
                this.serviceIntegration.sites[0].id,
                this.myFormGroup.value
            )
            .subscribe();
    }

    /**
     * Redirects to service configuration listing page
     *
     * @param string key
     * @memberof DotServiceIntegrationListComponent
     */
    goToIntegration(key: string): void {
        this.dotRouterService.gotoPortlet(`/integration-services/${key}`);
    }
}
