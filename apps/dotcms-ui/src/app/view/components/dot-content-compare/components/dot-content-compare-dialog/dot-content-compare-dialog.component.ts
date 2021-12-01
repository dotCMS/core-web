import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { COMPARE_CUSTOM_EVENT } from '@services/dot-custom-event-handler/dot-custom-event-handler.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'dot-content-compare-dialog',
    templateUrl: './dot-content-compare-dialog.component.html',
    styleUrls: ['./dot-content-compare-dialog.component.scss']
})
export class DotContentCompareDialogComponent implements OnInit, OnDestroy {
    constructor(private dotEventsService: DotEventsService) {}

    show = true;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit(): void {
        this.dotEventsService
            .listen(COMPARE_CUSTOM_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                debugger;
                this.show = true;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    close(): void {
        this.show = false;
    }
}
