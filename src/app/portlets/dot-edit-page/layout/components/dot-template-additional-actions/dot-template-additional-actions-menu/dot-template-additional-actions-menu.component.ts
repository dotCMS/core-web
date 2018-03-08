import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { DotMessageService } from '../../../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-template-addtional-actions-menu',
    templateUrl: './dot-template-additional-actions-menu.component.html'
})
export class DotTemplateAdditionalActionsMenuComponent implements OnInit {
    @Input() inode: string;
    items: MenuItem[];

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        const keys = [
            'template.action.additional.permissions',
            'template.action.additional.history',
            'template.action.additional.properties'
        ];

        this.dotMessageService.getMessages(keys).subscribe((messages) => {
            this.items = [
                {
                    label: messages['template.action.additional.properties'],
                    routerLink: `template/${this.inode}/properties`
                },
                {
                    label: messages['template.action.additional.permissions'],
                    routerLink: `template/${this.inode}/permissions`
                },
                {
                    label: messages['template.action.additional.history'],
                    routerLink: `template/${this.inode}/history`
                }
            ];
        });
    }
}
