import { Component, OnInit, Input } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'dot-sidebar-properties',
    templateUrl: './dot-sidebar-properties.component.html'
})
export class DotSidebarPropertiesComponent implements OnInit {
    @Input() group: FormGroup;

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService.getMessages([
            'editpage.layout.sidebar.width.small',
            'editpage.layout.sidebar.width.medium',
            'editpage.layout.sidebar.width.large'
        ]).subscribe();
    }
}
