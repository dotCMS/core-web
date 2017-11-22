import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { DotEditLayoutGridComponent } from '../dot-edit-layout-grid/dot-edit-layout-grid.component';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { PageViewService } from '../../../../api/services/page-view/page-view.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    @ViewChild('editLayoutGrid') editLayoutGrid: DotEditLayoutGridComponent;

    pageView: Observable<DotPageView>;

    constructor(public router: Router, private route: ActivatedRoute, private pageViewService: PageViewService) {}

    ngOnInit(): void {
        this.pageView = this.route.data.pluck('pageView');
    }

    public saveLayout() {
        const layoutBody: DotLayoutBody = this.editLayoutGrid.getLayoutBody();
        this.pageView.subscribe(pageView => {
            this.pageViewService
                .save(<DotPageView>{
                    page: pageView.page,
                    layout: {
                        body: layoutBody
                    }
                })
                .subscribe();
        });
    }
}
