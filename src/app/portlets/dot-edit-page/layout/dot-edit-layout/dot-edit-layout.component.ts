import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    data: any;

    constructor(public router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.pluck('pageView').subscribe(res => this.data = res);
        console.log('data: ', this.data);
    }
}
