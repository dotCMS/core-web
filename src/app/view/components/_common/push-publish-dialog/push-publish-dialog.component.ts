import { BehaviorSubject } from 'rxjs/Rx';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PushPublishService } from '../../../../api/services/push-publish/push-publish.service';
import { SelectItem } from 'primeng/primeng';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-push-publish-dialog',
    styleUrls: ['./push-publish-dialog.component.scss'],
    templateUrl: 'push-publish-dialog.component.html'
})

export class PushPublishContentTypesDialogComponent implements OnInit {
    publishdate: Date;
    expiredate: Date;
    form: FormGroup;
    errorMessage: BehaviorSubject<string> = new BehaviorSubject(null);
    forcePushCheckbox = false;
    pushActions: SelectItem[];
    publish = true;
    showExpireDate = false;
    submitted = false;
    @Input() displayDialog = false;
    @Input() contentTypeId: string;
    @Output() cancel = new EventEmitter<boolean>();

    constructor(
        private pushPublishService: PushPublishService,
        public fb: FormBuilder,
        public dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.pushActions = [
            { label: 'Push', value: 'publish' },
            { label: 'Remove', value: 'expire' },
            { label: 'Push Expire', value: 'publishexpire' }
        ];
        this.publishdate = new Date;
        this.expiredate = new Date;

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

        this.form = this.fb.group({
            pushActionSelected: [this.pushActions[0].value || '', [Validators.required]],
            publishdate: [this.publishdate || '', [Validators.required]],
            expiredate: [this.expiredate || '', [Validators.required]],
            environment: ['', [Validators.required]],
            forcePush: this.forcePushCheckbox || ''
        });
    }

    /**
     * Close dialog after click on cancel button
     * @returns {boolean}
     * @memberof PushPublishContentTypesDialogComponent
     */
    close(): boolean {
        this.cancel.emit(true);
        this.form.reset();
        return false;
    }

    /**
     * It shows publish date or expire date when selecting push action dropdown
     * @param {any} $event
     * @memberof PushPublishContentTypesDialogComponent
     */
    pushActionChange($event): void {
        switch ($event.value) {
            case 'publish':
                this.publish = true;
                this.showExpireDate = false;
                break;
            case 'expire':
                this.publish = false;
                this.showExpireDate = true;
                break;
            case 'publishexpire':
                this.publish = true;
                this.showExpireDate = true;
                break;
            default:
                break;
        }
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
            this.pushPublishService.pushPublishContent(this.contentTypeId, this.form.value).subscribe((result: any) => {
                if (!result.errors) {
                    this.close();
                    this.errorMessage = null;
                } else {
                    this.errorMessage.next('Sorry there was an error please try again');
                }
            });
            this.form.reset();
        }
    }
}
