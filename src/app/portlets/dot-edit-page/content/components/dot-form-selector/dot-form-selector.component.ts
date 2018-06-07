import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginatorService } from '../../../../../api/services/paginator';
import { Observable } from 'rxjs/Observable';
import { ContentType } from '../../../../content-types/shared/content-type.model';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';

@Component({
    providers: [PaginatorService],
    selector: 'dot-form-selector',
    templateUrl: './dot-form-selector.component.html',
    styleUrls: ['./dot-form-selector.component.scss']
})
export class DotFormSelectorComponent implements OnInit {
    @Input() show = false;
    @Output() select = new EventEmitter<ContentType>();
    @Output() close = new EventEmitter<any>();

    items: Observable<ContentType[]>;
    nameColumnLabel: string;

    constructor(private paginatorService: PaginatorService, private dotMessageService: DotMessageService) {
        this.dotMessageService
            .getMessages(['contenttypes.form.name', 'dot.common.select'])
            .subscribe(messages => this.nameColumnLabel = messages['contenttypes.form.name']);
    }

    ngOnInit() {
        this.paginatorService.url = 'v1/contenttype?type=FORM';
        this.items = this.paginatorService.getCurrentPage();
    }
}
