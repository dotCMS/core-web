import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'dot-dot-template-props',
    templateUrl: './dot-template-props.component.html',
    styleUrls: ['./dot-template-props.component.scss']
})
export class DotTemplatePropsComponent implements OnInit {
    constructor(private config: DynamicDialogConfig) {}

    ngOnInit(): void {
        console.log(this.config.data.template);
    }
}
