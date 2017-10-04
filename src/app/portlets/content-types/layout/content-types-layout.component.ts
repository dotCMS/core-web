import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../api/services/messages-service';
import { DragulaService } from 'ng2-dragula';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'content-type-layout',
    styleUrls: ['./content-types-layout.component.scss'],
    templateUrl: 'content-types-layout.component.html'
})

export class ContentTypesLayoutComponent extends BaseComponent implements OnChanges {
    @Input() contentTypeId: string;

    permissionURL: string;
    pushHistoryURL: string;
    relationshipURL: string;

    constructor(messageService: MessageService) {
        super([
            'contenttypes.sidebar.components.title',
            'contenttypes.tab.fields.header',
            'contenttypes.sidebar.layouts.title',
            'contenttypes.tab.permissions.header',
            'contenttypes.tab.publisher.push.history.header',
            'contenttypes.tab.relationship.header',
        ], messageService);
    }

    ngOnChanges(changes): void {
        if (changes.contentTypeId.currentValue) {
            this.permissionURL = `/html/content_types/permissions.jsp?contentTypeId=${changes.contentTypeId.currentValue}&popup=true`;
            this.pushHistoryURL = `/html/content_types/push_history.jsp?contentTypeId=${changes.contentTypeId.currentValue}&popup=true`;
            // tslint:disable-next-line:max-line-length
            this.relationshipURL = `c/portal/layout?p_l_id=56fedb43-dbbf-4ce2-8b77-41fb73bad015&p_p_id=content-types&_content_types_struts_action=%2Fext%2Fstructure%2Fview_relationships&_content_types_structure_id=${changes.contentTypeId.currentValue}`;
        }
    }
}
