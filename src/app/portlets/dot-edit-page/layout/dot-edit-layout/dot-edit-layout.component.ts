import { Component, OnInit } from '@angular/core';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { getTemplateTypeFlag } from '../../../../api/util/lib';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    isAdvancedTemplate: Observable<boolean>;
    pageState: Observable<DotRenderedPageState>;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.pageState = this.route.parent.parent.data.pluck('content');
        this.isAdvancedTemplate = this.pageState.let(getTemplateTypeFlag);
    }
}
