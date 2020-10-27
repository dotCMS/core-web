import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dot-template-test',
    templateUrl: './dot-template.component.html',
    styleUrls: ['./dot-template.scss']
})
export class DotTemplateComponent implements OnInit {
    ngOnInit(): void {
        console.log('started');
    }
}
