import { DotRouterService } from './../../../api/services/dot-router/dot-router.service';
import { DotHttpErrorManagerService } from './../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { ResponseView } from 'dotcms-js/core/util/response-view';
import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { DotEditContentHtmlService } from './services/dot-edit-content-html.service';
import { DotDialogService } from '../../../api/services/dot-dialog';
import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { DotLoadingIndicatorService } from '../../../view/components/_common/iframe/dot-loading-indicator/dot-loading-indicator.service';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { DotRenderedPage } from '../shared/models/dot-rendered-page.model';
import { DotGlobalMessageService } from '../../../view/components/_common/dot-global-message/dot-global-message.service';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { DotPageContainer } from '../shared/models/dot-page-container.model';
import { DotPageContent } from '../shared/models/dot-page-content.model';
import { Workflow } from '../../../shared/models/workflow/workflow.model';
import { Observable } from 'rxjs/Observable';
import { WorkflowService } from '../../../api/services/workflow/workflow.service';
import { DotEditPageToolbarComponent } from './components/dot-edit-page-toolbar/dot-edit-page-toolbar.component';
import { EditPageService } from '../../../api/services/edit-page/edit-page.service';
import { DotEditPageState } from '../../../shared/models/dot-edit-page-state/dot-edit-page-state.model';
import { DotRenderedPageState } from '../shared/models/dot-rendered-page-state.model';
import { PageMode } from './shared/page-mode.enum';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { DotEditPageViewAs } from '../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotViewAsService } from '../../../api/services/dot-view-as/dot-view-as.service';

@Component({
    selector: 'dot-edit-content',
    templateUrl: './dot-edit-content.component.html',
    styleUrls: ['./dot-edit-content.component.scss']
})
export class DotEditContentComponent implements OnInit {
    @ViewChild('contentletActionsIframe') contentletActionsIframe: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('toolbar') toolbar: DotEditPageToolbarComponent;

    contentletActionsUrl: SafeResourceUrl;
    dialogSize = {
        height: null,
        width: null
    };
    dialogTitle: string;
    isModelUpdated = false;
    page: DotRenderedPage;
    pageWorkFlows: Observable<Workflow[]>;
    device: DotDevice;

    private originalValue: any;

    constructor(
        private dotContainerContentletService: DotContainerContentletService,
        private dotDialogService: DotDialogService,
        private dotGlobalMessageService: DotGlobalMessageService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotMenuService: DotMenuService,
        private dotMessageService: DotMessageService,
        private dotRouterService: DotRouterService,
        private editPageService: EditPageService,
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private workflowsService: WorkflowService,
        private dotViewAsService: DotViewAsService,
        public dotEditContentHtmlService: DotEditContentHtmlService,
        public dotLoadingIndicatorService: DotLoadingIndicatorService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'editpage.content.contentlet.remove.confirmation_message.message',
                'editpage.content.contentlet.remove.confirmation_message.header',
                'editpage.content.contentlet.add.content',
                'dot.common.message.saving',
                'dot.common.message.saved'
            ])
            .subscribe();

        this.dotEditContentHtmlService.contentletEvents.subscribe((contentletEvent: any) => {
            this.ngZone.run(() => {
                this.contentletEventsHandler(contentletEvent.name)(contentletEvent);
            });
        });

        this.dotEditContentHtmlService.pageModelChange.filter(model => model.length).subscribe(model => {
            if (this.originalValue) {
                this.ngZone.run(() => {
                    this.isModelUpdated = !_.isEqual(model, this.originalValue);
                });
            } else {
                this.setOriginalValue(model);
            }
        });

        this.dotLoadingIndicatorService.show();

        this.route.data.pluck('content').subscribe((page: DotRenderedPage) => {
            this.dotViewAsService.selected = page.viewAs;
            this.page = page;
            this.renderPage(page);
        });

        this.pageWorkFlows = this.workflowsService.getPageWorkflows(this.page.identifier);
        this.setDialogSize();
    }

    /**
     * Callback when dialog hide
     *
     * @memberof DotEditContentComponent
     */
    onHideDialog(): void {
        this.dialogTitle = null;
        this.contentletActionsUrl = null;
    }

    /**
     * Handle the iframe page load
     * @param {any} $event
     * @memberof DotEditContentComponent
     */
    onLoad(_event): void {
        this.dotLoadingIndicatorService.hide();
    }

    /**
     * Handle the changes of the state gf the page
     *
     * @param {*} state
     * @memberof DotEditContentComponent
     */

    statePageHandler(state: DotEditPageState): void {
        if (this.isLockModified(state.locked)) {
            this.dotGlobalMessageService.display(this.dotMessageService.get('dot.common.message.saving'));
        }

        this.editPageService.setPageState(this.page, state).subscribe(
            (dotRenderedPageState: DotRenderedPageState) => {
                this.setPage(dotRenderedPageState.dotRenderedPage);

                if (this.isLockModified(state.locked)) {
                    this.dotGlobalMessageService.display(this.dotMessageService.get('dot.common.message.saved'));
                }
            },
            (err: ResponseView) => {
                this.handleSetPageStateFailed(err);
            }
        );
    }

    /**
     * Save the page's content
     *
     * @memberof DotEditContentComponent
     */
    saveContent(): void {
        this.dotGlobalMessageService.loading(this.dotMessageService.get('dot.common.message.saving'));
        this.dotContainerContentletService
            .saveContentlet(this.page.identifier, this.dotEditContentHtmlService.getContentModel())
            .subscribe(() => {
                this.dotGlobalMessageService.display(this.dotMessageService.get('dot.common.message.saved'));
                this.setOriginalValue();
            });
    }

    /**
     * Hanlde changes in the configuration of "View As" toolbar
     *
     * @param {DotEditPageViewAs} viewAsConfig
     * @memberof DotEditContentComponent
     */
    changeViewAsHandler(viewAsConfig: DotEditPageViewAs): void {
        this.route.queryParams.subscribe(params => {
            this.editPageService.getPageModeMethod(this.page.mode)(
                params['url'],
                viewAsConfig
            ).subscribe((page: DotRenderedPage) => {
                this.setPage(page);
            });
        });
    }

    /**
     * Hanlde changes in the Device from the "View As" toolbar
     *
     * @param {Device} device
     * @memberof DotEditContentComponent
     */
    changeDeviceHandler(device: DotDevice): void {
        this.device = device;
    }

    private addContentlet($event: any): void {
        const container: DotPageContainer = {
            identifier: $event.dataset.dotIdentifier,
            uuid: $event.dataset.dotUuid
        };
        this.dotEditContentHtmlService.setContainterToAppendContentlet(container);
        this.dialogTitle = this.dotMessageService.get('editpage.content.contentlet.add.content');

        this.loadDialogEditor(
            `/html/ng-contentlet-selector.jsp?ng=true&container_id=${$event.dataset.dotIdentifier}&add=${$event.dataset
                .dotAdd}`,
            $event.contentletEvents
        );
    }

    private closeDialog(): void {
        this.dialogTitle = null;
        this.contentletActionsUrl = null;
    }

    private editContentlet($event: any): void {
        const container: DotPageContainer = {
            identifier: $event.container.dotIdentifier,
            uuid: $event.container.dotUuid
        };
        this.dotEditContentHtmlService.setContainterToEditContentlet(container);

        this.dotMenuService.getDotMenuId('content').subscribe((portletId: string) => {
            // tslint:disable-next-line:max-line-length
            const url = `/c/portal/layout?p_l_id=${portletId}&p_p_id=content&p_p_action=1&p_p_state=maximized&p_p_mode=view&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet&_content_cmd=edit&inode=${$event
                .dataset
                .dotInode}&referer=%2Fc%2Fportal%2Flayout%3Fp_l_id%3D${portletId}%26p_p_id%3Dcontent%26p_p_action%3D1%26p_p_state%3Dmaximized%26_content_struts_action%3D%2Fext%2Fcontentlet%2Fview_contentlets`;

            // TODO: this will get the title of the contentlet but will need and update to the endpoint to do it
            this.dialogTitle = 'Edit Contentlet';
            this.loadDialogEditor(url, $event.contentletEvents);
        });
    }

    private contentletEventsHandler(event: any): Function {
        const eventsHandlerMap = {
            edit: this.editContentlet.bind(this),
            add: this.addContentlet.bind(this),
            remove: this.removeContentlet.bind(this),
            select: this.closeDialog.bind(this),
            cancel: () => {},
            save: () => {}
        };

        return eventsHandlerMap[event];
    }

    private handleSetPageStateFailed(err: ResponseView): void {
        this.dotHttpErrorManagerService.handle(err).subscribe((res: any) => {
            if (res.forbidden) {
                this.dotRouterService.gotoPortlet('/c/site-browser');
            } else {
                this.route.queryParams
                    .pluck('url')
                    .concatMap((url: string) => this.editPageService.getEdit(url))
                    .subscribe((page: DotRenderedPage) => {
                        this.setPage(page);
                    });
            }
        });
    }

    private isLockModified(lock: boolean) {
        return lock === true || lock === false;
    }

    private loadDialogEditor(url: string, contentletEvents: Subject<any>): void {
        this.setDialogSize();
        this.contentletActionsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        /*
            We have an ngIf in the <iframe> to prevent the jsp to load before the dialog shows, so we need to wait that
            element it's available in the DOM
        */
        setTimeout(() => {
            const editContentletIframeEl = this.contentletActionsIframe.nativeElement;

            /*
                TODO: should I remove this listener when when the dialog closes?
            */
            editContentletIframeEl.addEventListener('load', () => {
                editContentletIframeEl.contentWindow.ngEditContentletEvents = contentletEvents;
            });
        }, 0);
    }

    private removeContentlet($event: any): void {
        this.dotDialogService.confirm({
            accept: () => {
                const pageContainer: DotPageContainer = {
                    identifier: $event.container.dotIdentifier,
                    uuid: $event.container.dotUuid
                };

                const pageContent: DotPageContent = {
                    inode: $event.dataset.dotInode,
                    identifier: $event.dataset.dotIdentifier
                };

                this.dotEditContentHtmlService.removeContentlet(pageContainer, pageContent);
            },
            header: this.dotMessageService.get('editpage.content.contentlet.remove.confirmation_message.header'),
            message: this.dotMessageService.get('editpage.content.contentlet.remove.confirmation_message.message')
        });
    }

    private renderPage(page: DotRenderedPage): void {
        if (page.mode === PageMode.EDIT && !page.lockedByAnotherUser) {
            this.dotEditContentHtmlService.initEditMode(page.render, this.iframe);
        } else {
            this.dotEditContentHtmlService.renderPage(page.render, this.iframe);
        }
    }

    private setDialogSize(): void {
        this.dialogSize = {
            width: window.innerWidth - 200,
            height: window.innerHeight - 100
        };
    }

    private setPage(page: DotRenderedPage): void {
        this.page = page;
        this.renderPage(page);
    }

    private setOriginalValue(model?: any): void {
        this.originalValue = model || this.dotEditContentHtmlService.getContentModel();
        this.isModelUpdated = false;
    }
}
