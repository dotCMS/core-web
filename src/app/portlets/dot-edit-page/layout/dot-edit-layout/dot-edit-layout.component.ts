import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {PageView} from '../../shared/models/page-view.model';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {

    pageView: PageView;

    constructor(public router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.pluck('pageView').subscribe( (res: PageView) => (this.pageView = res));
    }
}
