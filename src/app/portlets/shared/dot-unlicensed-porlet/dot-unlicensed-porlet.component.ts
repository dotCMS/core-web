import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UnlicensedPortletData } from '@services/dot-license/dot-license.service';

@Component({
    selector: 'dot-unlicensed-porlet',
    templateUrl: './dot-unlicensed-porlet.component.html',
    styleUrls: ['./dot-unlicensed-porlet.component.scss']
})
export class DotUnlicensedPorletComponent implements OnChanges {
    @Input() data: UnlicensedPortletData;

    messagesKey: { [key: string]: string } = {};
    requestLicenseLabel$: Observable<string>;

    constructor(private dotMessageService: DotMessageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data.currentValue) {
            this.dotMessageService
                .getMessages([
                    this.data.titleKey,
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
}
