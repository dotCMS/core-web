import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageView } from '../../shared/models/page-view.model';
import { DotEditLayoutGridComponent } from '../dot-edit-layout-grid/dot-edit-layout-grid.component';
import { LayoutBody } from '../../shared/models/layout-body.model';
import { PageViewService } from '../../../../api/services/page-view/page-view.service';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    @ViewChild('editLayoutGrid') editLayoutGrid: DotEditLayoutGridComponent;

    pageView: PageView;

    constructor(public router: Router, private route: ActivatedRoute, private pageViewService: PageViewService) {}

    ngOnInit(): void {
        this.route.data.pluck('pageView').subscribe((res: PageView) => (this.pageView = res));
    }

    public saveLayout() {
        let layoutBody: LayoutBody = this.editLayoutGrid.getLayoutBody();
        this.pageViewService.save(
            <PageView> {
                page: this.pageView.page,
                layout: {
                    body: layoutBody
                }
            }
        ).subscribe();
    }
}
