import { Component } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { CrumbTrailService } from './services/dot-crumb-trail.service';

@Component({
    selector: 'dot-crumb-trail',
    templateUrl: './dot-crumb-trail.component.html'
})
export class DotCrumbTrailComponent {
    public crumbs: Observable<MenuItem[]>;

    constructor(private crumbTrailService: CrumbTrailService) {
        this.crumbs = this.crumbTrailService.crumbTrails;
    }
}
