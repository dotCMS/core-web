import { map, pluck } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DotPageRenderState } from '../../shared/models/dot-rendered-page-state.model';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    isAdvancedTemplate: Observable<boolean>;
    pageState: Observable<DotPageRenderState>;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.pageState = this.route.parent.parent.data.pipe(pluck('content'));

        this.isAdvancedTemplate = this.pageState.pipe(
            map(
                (dotRenderedPageState: DotPageRenderState) =>
                    dotRenderedPageState.template && !dotRenderedPageState.template.drawed
            )
        );
    }
}
