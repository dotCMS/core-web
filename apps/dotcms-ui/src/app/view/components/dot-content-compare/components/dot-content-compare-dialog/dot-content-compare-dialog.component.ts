import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { COMPARE_CUSTOM_EVENT } from '@services/dot-custom-event-handler/dot-custom-event-handler.service';
import { Subject } from 'rxjs';
import { DotContentCompareComponent } from '@components/dot-content-compare/dot-content-compare.component';
import { DotEvent } from '@models/dot-event/dot-event';

@Component({
    selector: 'dot-content-compare-dialog',
    templateUrl: './dot-content-compare-dialog.component.html',
    styleUrls: ['./dot-content-compare-dialog.component.scss']
})
export class DotContentCompareDialogComponent implements OnInit, OnDestroy {
    @ViewChild('contentCompare', { static: false })
    contentCompareComponent: DotContentCompareComponent;
    show = false;

    constructor(private dotEventsService: DotEventsService) {}

    private destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit(): void {
        this.dotEventsService
            .listen(COMPARE_CUSTOM_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: DotEvent) => {
                this.contentCompareComponent.data = event.data;
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
