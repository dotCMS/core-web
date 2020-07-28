import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'dot-comment-form',
    templateUrl: './dot-comment-form.component.html',
    styleUrls: ['./dot-comment-form.component.scss']
})
export class DotCommentFormComponent implements OnInit {
    comment: string;
    @Output() value = new EventEmitter<{ [key: string]: string }>();

    constructor() {}

    ngOnInit() {}

    emit(): void {
        this.value.emit({ comment: this.comment });
    }
}
