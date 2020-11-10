import { pluck, filter, take } from 'rxjs/operators';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotPageRenderState } from '../../shared/models/dot-rendered-page-state.model';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotGlobalMessageService } from '@components/_common/dot-global-message/dot-global-message.service';
import { DotPageRender } from '@portlets/dot-edit-page/shared/models';
import { DotPageLayoutService } from '@services/dot-page-layout/dot-page-layout.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { ResponseView, LoginService } from 'dotcms-js';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    pageState: DotPageRenderState;

    @HostBinding('style.minWidth') width = '100%';

    constructor(
        private route: ActivatedRoute,
        private dotRouterService: DotRouterService,
        private dotGlobalMessageService: DotGlobalMessageService,
        private loginService: LoginService,
        private dotPageLayoutService: DotPageLayoutService,
        private dotMessageService: DotMessageService
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
            });
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
     * @param {*} value
     * @memberof DotEditLayoutComponent
     */
    onSave(value: any): void {
        // TODO: needs to type this
        this.dotGlobalMessageService.loading(
            this.dotMessageService.get('dot.common.message.saving')
        );

        this.dotPageLayoutService
            .save(this.pageState.page.identifier, value)
            .pipe(take(1))
            .subscribe(
                (updatedPage: DotPageRender) => {
                    this.dotGlobalMessageService.success(
                        this.dotMessageService.get('dot.common.message.saved')
                    );
                    this.pageState = new DotPageRenderState(
                        this.loginService.auth.user,
                        updatedPage
                    );
                },
                (err: ResponseView) => {
                    this.dotGlobalMessageService.error(err.response.statusText);
                }
            );
    }
}
