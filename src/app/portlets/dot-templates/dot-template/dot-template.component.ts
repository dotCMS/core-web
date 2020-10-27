import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dot-template-test',
    templateUrl: './dot-template.component.html',
    styleUrls: []
})
export class DotTemplateComponent implements OnInit {
    ngOnInit(): void {
        console.log('started');
    }
}
