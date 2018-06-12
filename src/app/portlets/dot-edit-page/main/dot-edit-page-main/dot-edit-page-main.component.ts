import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { DotContentletEditorService } from '../../../../view/components/dot-contentlet-editor/services/dot-contentlet-editor.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { DotPageStateService } from '../../content/services/dot-page-state/dot-page-state.service';

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
        private dotContentletEditorService: DotContentletEditorService,
        private dotPageStateService: DotPageStateService
    ) {}

    ngOnInit() {
        this.pageState = this.route.data.pluck('content');
        this.subscribeIframeCloseAction();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle the call of contentlet dialog
     *
     * @param {inode: string; label: string} buttonClicked
     * @memberof DotEditPageMainComponent
     */
    openPageProperties(buttonClicked: { inode: string; label: string }) {
        this.dotContentletEditorService.edit({
            data: {
                inode: buttonClicked.inode
            }
        });
    }

    private subscribeIframeCloseAction(): void {
        this.dotContentletEditorService.close$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dotPageStateService.reload(this.route.snapshot.queryParams.url);
        });
    }
}
