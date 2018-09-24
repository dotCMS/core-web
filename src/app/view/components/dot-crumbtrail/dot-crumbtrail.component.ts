import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotCrumbtrailService, Crumb } from './service/dot-crumbtrail.service';
@Component({
    selector: 'dot-crumbtrail',
    templateUrl: './dot-crumbtrail.component.html',
    styleUrls: ['./dot-crumbtrail.component.scss']
})
export class DotCrumbtrailComponent implements OnInit {
    crumb: Observable<Crumb[]>;

    constructor(private crumbTrailService: DotCrumbtrailService) {

    }

    ngOnInit() {
        this.crumb = this.crumbTrailService.crumbTrail$;
    }
}
