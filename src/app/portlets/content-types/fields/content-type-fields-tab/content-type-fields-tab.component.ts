import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { FieldTab } from '../shared';
import { DotMessageService } from '@services/dot-messages-service';
import { FieldDivider } from '@portlets/content-types/fields/shared/field-divider.interface';
import { DotAlertConfirmService } from '@services/dot-alert-confirm/dot-alert-confirm.service';

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

    @Output() editTab: EventEmitter<FieldDivider> = new EventEmitter();
    @Output() removeTab: EventEmitter<FieldDivider> = new EventEmitter();

    i18nMessages: any = {};

    constructor(private dotMessageService: DotMessageService, private dotDialogService: DotAlertConfirmService) {}

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

    changeLabel(): void {
        this.editTab.emit(this.fieldTab);
    }

    removeItem($event: MouseEvent): void {
        $event.stopPropagation();
        this.dotDialogService.confirm({
            accept: () => {
                this.removeTab.emit(this.fieldTab);
            },
            header: `${this.i18nMessages['contenttypes.action.delete']} ${this.i18nMessages['contenttypes.content.field']}`,
            message: this.dotMessageService.get('contenttypes.confirm.message.delete.field', this.fieldTab.getFieldDivider().name),
            footerLabel: {
                accept: this.i18nMessages['contenttypes.action.delete'],
                reject: this.i18nMessages['contenttypes.action.cancel']
            }
        });
    }


}
