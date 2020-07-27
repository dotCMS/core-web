import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { PushPublishService } from '@services/push-publish/push-publish.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotPushPublishDialogService, LoggerService } from 'dotcms-js';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { DotPushPublishDialogData } from 'dotcms-models';
import { DotPushPublishData } from '@models/dot-push-publish-data/dot-push-publish-data';

@Component({
    selector: 'dot-push-publish-dialog',
    styleUrls: ['./dot-push-publish-dialog.component.scss'],
    templateUrl: 'dot-push-publish-dialog.component.html'
})
export class DotPushPublishDialogComponent implements OnInit, OnDestroy {
    dialogActions: DotDialogActions;
    dialogShow = false;
    eventData: DotPushPublishDialogData;
    formData: DotPushPublishData;
    formValid = false;

    @Input() assetIdentifier: string;

    @Output() cancel = new EventEmitter<boolean>();

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private pushPublishService: PushPublishService,
        private dotMessageService: DotMessageService,
        private dotPushPublishDialogService: DotPushPublishDialogService,
        private loggerService: LoggerService
    ) {}

    ngOnInit() {
        this.dotPushPublishDialogService.showDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DotPushPublishDialogData) => {
                this.showDialog(data);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close the dialog.
     * @memberof PushPublishContentTypesDialogComponent
     */
    close(): void {
        this.cancel.emit(true);
        this.dialogShow = false;
        this.eventData = null;
    }

    /**
     * When form is submitted
     * If form is valid then call pushPublishService with contentTypeId and form value params
     * @memberof PushPublishContentTypesDialogComponent
     */
    submitPushAction(): void {
        if (this.formValid) {
            this.pushPublishService
                .pushPublishContent(this.assetIdentifier, this.formData, !!this.eventData.isBundle)
                .pipe(takeUntil(this.destroy$))
                .subscribe((result: any) => {
                    if (!result.errors) {
                        this.close();
                    } else {
                        this.loggerService.debug(result.errorMessages);
                    }
                });
        }
    }

    updateFormValid(valid: boolean): void {
        this.dialogActions.accept.disabled = !valid;
        this.formValid = valid;
    }

    private showDialog(data: DotPushPublishDialogData): void {
        this.eventData = data;
        this.setDialogConfig();
        this.dialogShow = true;
    }

    private setDialogConfig(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.submitPushAction();
                },
                label: this.dotMessageService.get('contenttypes.content.push_publish.form.push'),
                disabled: this.formValid
            },
            cancel: {
                action: () => {
                    this.close();
                },
                label: this.dotMessageService.get('contenttypes.content.push_publish.form.cancel')
            }
        };
    }
}
