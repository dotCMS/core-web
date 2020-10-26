import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dot-dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss']
})
export class DotTemplateDesignerComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((res) => {
            console.log(res);
        });
    }
}
