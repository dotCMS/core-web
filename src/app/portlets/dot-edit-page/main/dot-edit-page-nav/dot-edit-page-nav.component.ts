import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-edit-page-nav',
    templateUrl: './dot-edit-page-nav.component.html',
    styleUrls: ['./dot-edit-page-nav.component.scss']
})
export class DotEditPageNavComponent implements OnInit {
    @Input() advancedTemplate: boolean;

    constructor(public route: ActivatedRoute, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['editpage.toolbar.nav.content', 'editpage.toolbar.nav.layout', 'editpage.toolbar.nav.code'])
            .subscribe();
    }
}
