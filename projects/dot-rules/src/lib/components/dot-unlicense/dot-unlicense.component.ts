import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../services/system/locale/I18n';

@Component({
    selector: 'dot-unlicense',
    templateUrl: './dot-unlicense.component.html',
    styleUrls: ['./dot-unlicense.component.scss']
})
export class DotUnlicenseComponent implements OnInit {
    rulesTitle: string;
    onlyEnterpriseLabel: string;
    learnMoreEnterpriseLabel: string;
    contactUsLabel: string;
    requestTrialLabel: string;

    constructor(resources: I18nService) {
        resources.get('com.dotcms.repackage.javax.portlet.title.rules').subscribe((label) => {
            this.rulesTitle = label;
        });
        resources.get('only-available-in-enterprise').subscribe((label) => {
            this.onlyEnterpriseLabel = label;
        });
        resources.get('Learn-more-about-dotCMS-Enterprise').subscribe((label) => {
            this.learnMoreEnterpriseLabel = label;
        });
        resources.get('Contact-Us-for-more-Information').subscribe((label) => {
            this.contactUsLabel = label;
        });
        resources.get('request-trial-license').subscribe((label) => {
            this.requestTrialLabel = label;
        });
    }

    ngOnInit() {}
}
