import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { MessageService } from '../../../../../api/services/messages-service';


@Component({
    selector: 'dot-legacy-addtional-actions-menu',
    templateUrl: './dot-legacy-additional-actions-menu.component.html'
})
export class DotLegacyAdditionalActionsMenuComponent implements OnInit {
    @Input() templateId: string;
    items: MenuItem[];

    constructor(private messageService: MessageService) {

    }

    ngOnInit() {
        const keys = [
            'template.action.additional.permissions',
            'template.action.additional.history',
            'template.action.additional.properties'
        ];

        this.messageService.getMessages(keys).subscribe(messages => {
            this.items = [
                {
                    label: messages['template.action.additional.properties'],
                    url: `/#/edit-page/template/${this.templateId}/properties`
                },
                {
                    label: messages['template.action.additional.permissions'],
                    url: `/#/edit-page/template/${this.templateId}/permissions`
                },
                {
                    label: messages['template.action.additional.history'],
                    url: `/#/edit-page/template/${this.templateId}/history`
                }
            ];
        });
    }
}
