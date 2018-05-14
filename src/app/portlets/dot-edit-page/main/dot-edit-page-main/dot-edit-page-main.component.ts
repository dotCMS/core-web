import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';

@Component({
    selector: 'dot-edit-page-main',
    templateUrl: './dot-edit-page-main.component.html',
    styleUrls: ['./dot-edit-page-main.component.scss']
})
export class DotEditPageMainComponent {
    pageState: Observable<DotRenderedPageState>;

    constructor(private route: ActivatedRoute, private router: Router) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && val.url.indexOf('/edit-page/content') > -1) {
                this.pageState = this.route.data.pluck('content');
            }
        });
    }
}
