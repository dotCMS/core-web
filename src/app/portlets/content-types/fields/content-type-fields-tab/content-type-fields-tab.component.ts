import { Component, Input, OnInit } from '@angular/core';

import { FieldTab } from '../shared';
import { DotMessageService } from '@services/dot-messages-service';

/**
 * Display Tab Field
 *
 * @export
 * @class ContentTypeFieldsTabComponent
 */
@Component({
    selector: 'dot-content-type-fields-tab',
    styleUrls: ['./content-type-fields-tab.component.scss'],
    templateUrl: './content-type-fields-tab.component.html'
})
export class ContentTypeFieldsTabComponent implements OnInit {
    @Input() fieldTab: FieldTab;

    i18nMessages: any = {};

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'contenttypes.dropzone.rows.empty.message',
                'contenttypes.action.delete',
                'contenttypes.confirm.message.delete.field',
                'contenttypes.confirm.message.delete.row',
                'contenttypes.content.field',
                'contenttypes.content.row',
                'contenttypes.action.cancel'
            ])
            .subscribe((res) => {
                this.i18nMessages = res;
            });
    }


}
