import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotTemplateItem } from '../store/dot-template.store';
import { DotCustomEventHandlerService } from '@services/dot-custom-event-handler/dot-custom-event-handler.service';

@Component({
    selector: 'dot-template-builder',
    templateUrl: './dot-template-builder.component.html',
    styleUrls: ['./dot-template-builder.component.scss']
})
export class DotTemplateBuilderComponent implements OnInit {
    @Input() item: DotTemplateItem;
    @Output() save = new EventEmitter<DotTemplateItem>();
    @Output() cancel = new EventEmitter();
    permissionsUrl = '';
    historyUrl = '';

    constructor(private dotCustomEventHandlerService: DotCustomEventHandlerService) {}

    ngOnInit() {
        this.permissionsUrl = `/html/templates/permissions.jsp?templateId=${this.item.identifier}&popup=true`;
        this.historyUrl = `/html/templates/push_history.jsp?templateId=${this.item.identifier}&popup=true`;
    }

    /**
     * Handle the custom events emmited by the Edit Contentlet
     *
     * @param CustomEvent $event
     * @memberof DotEditContentComponent
     */
    onCustomEvent($event: CustomEvent): void {
        this.dotCustomEventHandlerService.handle($event);
    }
}
