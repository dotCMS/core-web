import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { DotPageStateService } from '../../content/services/dot-page-state/dot-page-state.service';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-edit-page-main',
    templateUrl: './dot-edit-page-main.component.html',
    styleUrls: ['./dot-edit-page-main.component.scss']
})
export class DotEditPageMainComponent implements OnInit, OnDestroy {
    pageState: Observable<DotRenderedPageState>;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private dotPageStateService: DotPageStateService,
        public dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.pageState = this.route.data.pluck('content');
        this.subscribeIframeCloseAction();
        this.dotMessageService.getMessages(['editpage.toolbar.nav.properties']);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Call reload method to refresh page based on url
     *
     * @param {any} event
     * @memberof DotEditPageMainComponent
     */
    onCustomEvent(event: any): void {
        if (event.detail.name === 'close' && event.detail.htmlUrl) {
            this.dotPageStateService.reload(event.detail.htmlUrl.split('?')[0]);
        }
    }

    private subscribeIframeCloseAction(): void {
        this.dotPageStateService.reload$.pipe(takeUntil(this.destroy$)).subscribe((page: DotRenderedPageState) => {
            this.pageState = Observable.of(page);
        });
    }
}
