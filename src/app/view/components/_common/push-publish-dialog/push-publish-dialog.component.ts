import { BehaviorSubject } from 'rxjs/Rx';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { SelectItem } from 'primeng/primeng';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { LoggerService } from 'dotcms-js/dotcms-js';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-push-publish-dialog',
    styleUrls: ['./push-publish-dialog.component.scss'],
    templateUrl: 'push-publish-dialog.component.html'
})

export class PushPublishContentTypesDialogComponent implements OnInit {
    form: FormGroup;
    pushActions: SelectItem[];
    submitted = false;
    @Input() show = false;
    @Input() assetIdentifier: string;
    @Output() cancel = new EventEmitter<boolean>();

    constructor(
        private pushPublishService: PushPublishService,
        public fb: FormBuilder,
        public dotMessageService: DotMessageService,
        public loggerService: LoggerService
    ) {}

    ngOnInit() {
        this.pushActions = [
            { label: 'Push', value: PushPublishActions[0].toLowerCase() },
            { label: 'Remove', value: PushPublishActions[1].toLowerCase() },
            { label: 'Push Expire', value: PushPublishActions[2].toLowerCase() }
        ];

        this.dotMessageService.getMessages([
            'contenttypes.content.push_publish',
            'contenttypes.content.push_publish.I_want_To',
            'contenttypes.content.push_publish.force_push',
            'contenttypes.content.push_publish.publish_date',
            'contenttypes.content.push_publish.expire_date',
            'contenttypes.content.push_publish.push_to',
            'contenttypes.content.push_publish.push_to_errormsg',
            'contenttypes.content.push_publish.form.cancel',
            'contenttypes.content.push_publish.form.push'
        ]).subscribe();

        this.initForm();
    }

    /**
     * Close the dialog and reset the form
     * @memberof PushPublishContentTypesDialogComponent
     */
    close(): void {
        this.cancel.emit(true);
        this.initForm();
        this.submitted = false;
    }

    /**
     * When form is submitted
     * If form is valid then call pushPublishService with contentTypeId and form value params
     * @param {any} $event
     * @memberof PushPublishContentTypesDialogComponent
     */
    submitPushAction($event): void {
        this.submitted = true;
        if (this.form.valid) {
            this.pushPublishService.pushPublishContent(this.assetIdentifier, this.form.value).subscribe((result: any) => {
                if (!result.errors) {
                    this.close();
                } else {
                    this.loggerService.debug(result.errorMessages);
                }
            });
            this.form.reset();
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            pushActionSelected: [this.pushActions[0].value || '', [Validators.required]],
            publishdate: [new Date || '', [Validators.required]],
            expiredate: [new Date || '', [Validators.required]],
            environment: ['', [Validators.required]],
            forcePush: false
        });
    }
}

export enum PushPublishActions {
    Publish,
    Expire,
    PublishExpire
}
