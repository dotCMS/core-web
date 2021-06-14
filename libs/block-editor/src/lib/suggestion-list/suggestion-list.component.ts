import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dotcms-suggestion-list',
    templateUrl: './suggestion-list.component.html',
    styleUrls: ['./suggestion-list.component.scss']
})
export class SuggestionListComponent implements OnInit {
    loading = true;
    @Input() items = [];

    constructor() {}

    ngOnInit(): void {
    }
}
