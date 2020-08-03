import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DotFormModel} from '@models/dot-form/dot-form.model';

@Component({
    selector: 'dot-comment-form',
    templateUrl: './dot-comment-form.component.html',
    styleUrls: ['./dot-comment-form.component.scss']
})
export class DotCommentFormComponent implements OnInit, DotFormModel<any, any> {
    comment: string;
    @Input() required = true;
    @Output() value = new EventEmitter<{ [key: string]: string }>();
    @Output() valid = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {
        this.valid.emit(this.required ? this.comment ? true : false : true);
    }

    emit(): void {
        this.value.emit({ comment: this.comment });
        this.valid.emit(!!this.comment);
    }
}
