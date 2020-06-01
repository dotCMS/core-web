import { Component, Input, OnInit } from '@angular/core';
import {
    UnlicensedPortletData,
    DotLicenseService
} from '@services/dot-license/dot-license.service';
import { Observable } from 'rxjs';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-not-licensed-component',
    styleUrls: ['./not-licensed.component.scss'],
    templateUrl: 'not-licensed.component.html'
})
export class NotLicensedComponent implements OnInit {
    @Input() data: UnlicensedPortletData;

    messagesKey: { [key: string]: string } = {};
    requestLicenseLabel$: Observable<string>;
    unlicenseData: UnlicensedPortletData;

    constructor(
        private dotMessageService: DotMessageService,
        private dotLicense: DotLicenseService
    ) {}

    ngOnInit() {
        this.unlicenseData = this.dotLicense.getUnlicensedPortletData();
        this.dotMessageService
            .getMessages([
                this.unlicenseData.titleKey,
                ...[
                    'request.a.trial.license',
                    'Contact-Us-for-more-Information',
                    'Learn-more-about-dotCMS-Enterprise',
                    'only-available-in-enterprise'
                ]
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
    }
}
