import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotCrumbtrailService } from './service/dot-crumbtrail.service';

@Component({
    selector: 'dot-crumbtrail',
    templateUrl: './dot-crumbtrail.component.html',
    styleUrls: ['./dot-crumbtrail.component.scss'],
    providers: [DotCrumbtrailService]
})
export class DotCrumbtrailComponent implements OnInit {
    crumb: Observable<string>;

    constructor(private crumbTrailService: DotCrumbtrailService) {

    }

    ngOnInit() {
        this.crumb = this.crumbTrailService.crumbTrail$;
    }
}
