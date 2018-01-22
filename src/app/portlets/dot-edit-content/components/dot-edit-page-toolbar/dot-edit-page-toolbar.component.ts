import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
    selector: 'dot-edit-page-toolbar',
    templateUrl: './dot-edit-page-toolbar.component.html',
    styleUrls: ['./dot-edit-page-toolbar.component.scss']
})
export class DotEditPageToolbarComponent implements OnInit {
    @Input() pageTitle: string;
    @Input() pageUrl: string;
    @Input() canSave: boolean;

    @Output() save = new EventEmitter<MouseEvent>();

    states: SelectItem[];
    stateSelected: string = 'edit';

    constructor(public dotMessageService: DotMessageService) { }

    ngOnInit() {
        this.dotMessageService.getMessages([
            'editpage.toolbar.primary.action'
        ]).subscribe();

        this.states = [
            { label: 'Edit', value: 'edit' },
            { label: 'Preview', value: 'preview' },
            { label: 'Live', value: 'live' }
        ];
    }
}
