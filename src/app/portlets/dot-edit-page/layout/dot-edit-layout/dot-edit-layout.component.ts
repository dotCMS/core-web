import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { DotEditLayoutGridComponent } from '../dot-edit-layout-grid/dot-edit-layout-grid.component';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { PageViewService } from '../../../../api/services/page-view/page-view.service';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    @ViewChild('editLayoutGrid') editLayoutGrid: DotEditLayoutGridComponent;

    pageView: DotPageView;

    constructor(public router: Router, private route: ActivatedRoute, private pageViewService: PageViewService) {}

    ngOnInit(): void {
        this.route.data.pluck('pageView').subscribe((res: DotPageView) => (this.pageView = res));
    }

    public saveLayout() {
        let layoutBody: DotLayoutBody = this.editLayoutGrid.getLayoutBody();
        this.pageViewService.save(
            <DotPageView> {
                page: this.pageView.page,
                layout: {
                    body: layoutBody
                }
            }
        ).subscribe();
    }
}
