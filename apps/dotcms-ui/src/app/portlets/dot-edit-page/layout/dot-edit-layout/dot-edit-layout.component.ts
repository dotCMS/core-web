import { pluck, filter, take, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotPageRenderState } from '../../shared/models/dot-rendered-page-state.model';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotGlobalMessageService } from '@components/_common/dot-global-message/dot-global-message.service';
import { DotPageRender } from '@models/dot-page/dot-rendered-page.model';
import { DotPageLayoutService } from '@services/dot-page-layout/dot-page-layout.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { ResponseView } from '@dotcms/dotcms-js';
import { DotTemplateContainersCacheService } from '@services/dot-template-containers-cache/dot-template-containers-cache.service';
import { DotContainerMap, DotContainer } from '@shared/models/container/dot-container.model';
import { DotLayout } from '@models/dot-edit-layout-designer';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotEditLayoutService } from '@services/dot-edit-layout/dot-edit-layout.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit, OnDestroy {
    pageState: DotPageRender | DotPageRenderState;
    apiLink: string;

    didTemplateChanged = false;
    updateTemplate = new Subject<DotLayout>();
    destroy$: Subject<boolean> = new Subject<boolean>();

    @HostBinding('style.minWidth') width = '100%';

    constructor(
        private route: ActivatedRoute,
        private dotRouterService: DotRouterService,
        private dotGlobalMessageService: DotGlobalMessageService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotEditLayoutService: DotEditLayoutService,
        private dotPageLayoutService: DotPageLayoutService,
        private dotMessageService: DotMessageService,
        private templateContainersCacheService: DotTemplateContainersCacheService
    ) {}

    ngOnInit() {
        this.route.parent.parent.data
            .pipe(
                pluck('content'),
                filter((state: DotPageRenderState) => !!state),
                take(1)
            )
            .subscribe((state: DotPageRenderState) => {
                this.pageState = state;
                const mappedContainers = this.getRemappedContainers(state.containers);
                this.templateContainersCacheService.set(mappedContainers);
            });

        this.updateTemplate
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(10000),
                filter(() => this.didTemplateChanged),
                switchMap((layout: DotLayout) => {
                    this.dotGlobalMessageService.loading(
                        this.dotMessageService.get('dot.common.message.saving')
                    );

                    return this.dotPageLayoutService.save(this.pageState.page.identifier, {
                        ...layout,
                        title: null
                    });
                })
            )
            .subscribe(
                (updatedPage: DotPageRender) => this.handleSuccessSaveTemplate(updatedPage),
                (err: ResponseView) => this.handleErrorSaveTemplate(err),
                // On Complete
                () => (this.didTemplateChanged = false)
            );

        this.apiLink = `api/v1/page/render${this.pageState.page.pageURI}?language_id=${this.pageState.page.languageId}`;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle cancel in layout event
     *
     * @memberof DotEditLayoutComponent
     */
    onCancel(): void {
        this.dotRouterService.goToEditPage({
            url: this.pageState.page.pageURI
        });
    }

    /**
     * Handle save layout event
     *
     * @param {DotTemplate} value
     * @memberof DotEditLayoutComponent
     */
    onSave(value: DotLayout): void {
        this.dotGlobalMessageService.loading(
            this.dotMessageService.get('dot.common.message.saving')
        );

        this.dotPageLayoutService
            // To save a layout and no a template the title should be null
            .save(this.pageState.page.identifier, { ...value, title: null })
            .pipe(take(1))
            .subscribe(
                (updatedPage: DotPageRender) => this.handleSuccessSaveTemplate(updatedPage),
                (err: ResponseView) => this.handleErrorSaveTemplate(err),
                () => (this.didTemplateChanged = false)
            );
    }

    /**
     *  Handle next template value;
     *
     * @param {DotLayout} value
     * @memberof DotEditLayoutComponent
     */
    nextUpdateTemplate(value: DotLayout) {
        this.didTemplateChanged = true;
        this.updateTemplate.next(value);
    }

    /**
     *
     * Handle Success on Save template
     * @param {DotPageRender} updatedPage
     * @memberof DotEditLayoutComponent
     */
    private handleSuccessSaveTemplate(updatedPage: DotPageRender) {
        const mappedContainers = this.getRemappedContainers(updatedPage.containers);
        this.templateContainersCacheService.set(mappedContainers);

        this.dotGlobalMessageService.success(
            this.dotMessageService.get('dot.common.message.saved')
        );
        this.pageState = updatedPage;
    }

    /**
     *
     * Handle Error on Save template
     * @param {ResponseView} err
     * @memberof DotEditLayoutComponent
     */
    private handleErrorSaveTemplate(err: ResponseView) {
        this.dotGlobalMessageService.error(err.response.statusText);
        this.dotHttpErrorManagerService
            .handle(new HttpErrorResponse(err.response))
            .subscribe(() => {
                this.dotEditLayoutService.changeDesactivateState(true);
            });
    }

    private getRemappedContainers(containers: {
        [key: string]: {
            container: DotContainer;
        };
    }): DotContainerMap {
        return Object.keys(containers).reduce(
            (acc: { [key: string]: DotContainer }, id: string) => {
                return {
                    ...acc,
                    [id]: containers[id].container
                };
            },
            {}
        );
    }
}
