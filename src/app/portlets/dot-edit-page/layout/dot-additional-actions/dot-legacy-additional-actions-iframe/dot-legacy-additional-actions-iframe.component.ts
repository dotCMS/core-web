import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';

@Component({
    selector: 'dot-legacy-addtional-actions',
    templateUrl: './dot-legacy-additional-actions-iframe.component.html'
})
export class DotLegacyAdditionalActionsComponent implements OnInit {

    additionalPropertiesURL: string;

    constructor(private route: ActivatedRoute, private dotMenuService: DotMenuService) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(params => this.setAdditionalPropertiesURL(params.id, params.tabName));
    }

    private setAdditionalPropertiesURL(templateId: string, tabName: string): void {

        this.dotMenuService.getDotMenuId('templates').subscribe(portletId => {
            // tslint:disable-next-line:max-line-length
            this.additionalPropertiesURL = `c/portal/layout?p_l_id=${portletId}&p_p_id=templates&p_p_action=1&p_p_state=maximized&p_p_mode=view&_templates_struts_action=%2Fext%2Ftemplates%2Fedit_template&_templates_cmd=edit&inode=${templateId}&drawed=false&selectedTab=${tabName}`;
        });
    }
}
