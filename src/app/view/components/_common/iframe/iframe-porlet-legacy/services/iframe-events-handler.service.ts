import { Injectable } from '@angular/core';
import { DotLoadingIndicatorService } from '../../dot-loading-indicator/dot-loading-indicator.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotContentletEditorService } from '../../../../dot-contentlet-editor/services/dot-contentlet-editor.service';
import { DotUiColors, DotUiColorsService } from '@services/dot-ui-colors/dot-ui-colors.service';
import { DotIframeService } from '../../service/dot-iframe/dot-iframe.service';
import { DotCMSEditPageEvent } from '@components/dot-contentlet-editor/components/dot-contentlet-wrapper/dot-contentlet-wrapper.component';
import { DotPushPublishDialogService } from '@services/dot-push-publish-dialog/dot-push-publish-dialog.service';

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
        private dotContentletEditorService: DotContentletEditorService,
        private dotUiColorsService: DotUiColorsService,
        private dotIframeService: DotIframeService,
        private dotPushPublishDialogService: DotPushPublishDialogService
    ) {
        if (!this.handlers) {
            this.handlers = {
                'edit-page': this.goToEditPage.bind(this),
                'edit-contentlet': this.editContentlet.bind(this),
                'edit-task': this.editTask.bind(this),
                'create-contentlet': this.createContentlet.bind(this),
                'company-info-updated': this.setDotcmsUiColors.bind(this),
                'push-publish-dialog': this.pushPublishDialog.bind(this)
            };
        }
    }

    /**
     * Handle custom events from the iframe portlets
     *
     * @param CustomEvent event
     * @memberof DotIframeEventsHandler
     */
    handle(event: CustomEvent): void {
        if (this.handlers[event.detail.name]) {
            this.handlers[event.detail.name](event);
        }
    }

    private createContentlet($event: CustomEvent): void {
        this.dotContentletEditorService.create({
            data: $event.detail.data
        });
    }

    private goToEditPage($event: CustomEvent<DotCMSEditPageEvent>): void {
        this.dotLoadingIndicatorService.show();
        this.dotRouterService.goToEditPage({
            url: $event.detail.data.url,
            language_id: $event.detail.data.languageId,
            host_id: $event.detail.data.hostId
        });
    }

    private editContentlet($event: CustomEvent): void {
        this.dotRouterService.goToEditContentlet($event.detail.data.inode);
    }

    private editTask($event: CustomEvent): void {
        this.dotRouterService.goToEditTask($event.detail.data.inode);
    }

    private setDotcmsUiColors($event: CustomEvent): void {
        this.dotUiColorsService.setColors(document.querySelector('html'), <DotUiColors>$event.detail
            .payload.colors);
        this.dotIframeService.reloadColors();
    }

    private pushPublishDialog($event: CustomEvent): void {
        this.dotPushPublishDialogService.openDialog($event.detail.data);
    }
}
