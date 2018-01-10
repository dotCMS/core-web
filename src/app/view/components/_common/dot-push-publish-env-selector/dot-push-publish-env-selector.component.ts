import { SelectItem } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { ContentType } from '../../../../portlets/content-types/shared/content-type.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dot-push-publish-env-selector',
    styleUrls: ['./dot-push-publish-env-selector.component.scss'],
    templateUrl: 'dot-push-publish-env-selector.component.html'
})

export class PushPublishEnvSelectorComponent implements OnInit {
    pushEnvironments: Environment[];
    selectedEnvironment: Environment;
    data: ContentType;

    constructor(private pushPublishService: PushPublishService, private route: ActivatedRoute) {
        this.pushPublishService.loadPushPublishEnv().subscribe(environments => {
            console.log('environments: ', environments);
            this.pushEnvironments = environments;
        });
    }

    ngOnInit() {
        this.route.data.pluck('contentType').subscribe((contentType: ContentType) => {
            this.data = contentType;
            console.log('Content Type ID: ', contentType);
        });
    }

    // pushPublish(environment: any): void {
    //     this.pushPublishService.pushPublishContentType().subscribe((result: any) => {
    //         if (!result.errors) {
    //         this.close.emit({isCanceled: false});
    //         this.errorMessage = null;
    //         } else {
    //         this.errorMessage.next('Sorry there was an error please try again');
    //         }
    //     });
    // }
}

export interface Environment {
    id: string;
    name: string;
}
