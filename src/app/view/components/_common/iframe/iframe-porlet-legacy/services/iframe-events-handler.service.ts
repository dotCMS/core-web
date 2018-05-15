import { Injectable } from '@angular/core';
import { DotLoadingIndicatorService } from '../../dot-loading-indicator/dot-loading-indicator.service';
import { DotRouterService } from '../../../../../../api/services/dot-router/dot-router.service';
import { DotContentletEditorService } from '../../../../dot-contentlet-editor/services/dot-add-contentlet.service';

/**
 * Handle events triggered by the iframe in the IframePortletLegacyComponent
 *
 * @export
 * @class DotIframeEventsHandler
 */
@Injectable()
export class DotIframeEventsHandler {
    private readonly handlers;

    constructor(
        private dotLoadingIndicatorService: DotLoadingIndicatorService,
        private dotRouterService: DotRouterService,
        private dotContentletEditorService: DotContentletEditorService
    ) {
        if (!this.handlers) {
            this.handlers = {
                'edit-page': this.goToEditPage.bind(this),
                'edit-contentlet': this.editContentlet.bind(this)
            };
        }
    }

    handle(event: CustomEvent) {
        this.handlers[event.detail.name](event);
    }

    private goToEditPage($event: CustomEvent): void {
        this.dotLoadingIndicatorService.show();
        this.dotRouterService.goToEditPage($event.detail.data.url);
    }

    private editContentlet($event: CustomEvent): void {
        this.dotContentletEditorService.edit({
            data: $event.detail.data
        });
    }
}
