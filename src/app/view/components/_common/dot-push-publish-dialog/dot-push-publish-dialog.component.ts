import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { PushPublishService } from '@services/push-publish/push-publish.service';
import { SelectItem } from 'primeng/primeng';
import { DotMessageService } from '@services/dot-messages-service';
import { LoggerService } from 'dotcms-js';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { takeUntil, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { Subject } from 'rxjs';
import {
    DotPushPublishFiltersService,
    DotPushPublishFilter
} from '@services/dot-push-publish-filters/dot-push-publish-filters.service';
import { DotPushPublishDialogService } from '@services/dot-push-publish-dialog/dot-push-publish-dialog.service';
import { DotPushPublishEvent } from '@models/push-publish-data/push-publish-data';

@Component({
    selector: 'dot-push-publish-dialog',
    styleUrls: ['./dot-push-publish-dialog.component.scss'],
    templateUrl: 'dot-push-publish-dialog.component.html'
})
export class DotPushPublishDialogComponent implements OnInit, OnDestroy {
    dateFieldMinDate = new Date();
    dialogActions: DotDialogActions;
    dialogShow = false;
    form: FormGroup;
    pushActions: SelectItem[];
    filterOptions: SelectItem[];

    @Input() assetIdentifier: string;

    @Output() cancel = new EventEmitter<boolean>();

    @ViewChild('formEl') formEl: HTMLFormElement;
    @ViewChild('customCode') customCodeContainer: ElementRef;

    private destroy$: Subject<boolean> = new Subject<boolean>();
    private eventData: DotPushPublishEvent = { assetIdentifier: '', title: '' };
    private defaultFilterKey: string;
    private i18nMessages: { [key: string]: string } = {};

    constructor(
        private pushPublishService: PushPublishService,
        public fb: FormBuilder,
        public dotMessageService: DotMessageService,
        public loggerService: LoggerService,
        private dotPushPublishFiltersService: DotPushPublishFiltersService,
        private dotPushPublishDialogService: DotPushPublishDialogService,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.loadMessagesAndFilters();
        this.dotPushPublishDialogService.showDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DotPushPublishEvent) => {
                this.eventData = data;
                this.clearCustomCode();
                if (this.eventData.customCode) {
                    this.loadCustomCode();
                } else {
                    this.assetIdentifier = this.eventData.assetIdentifier;
                    this.pushActions = this.getPushPublishActions(this.i18nMessages);
                    this.initForm({
                        filterKey: this.defaultFilterKey
                    });
                    this.setDialogConfig(this.i18nMessages, this.form);
                }
                this.dialogShow = true;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close the dialog and reset the form
     * @memberof PushPublishContentTypesDialogComponent
     */
    close(): void {
        this.cancel.emit(true);
        this.dialogShow = false;
    }

    /**
     * When form is submitted
     * If form is valid then call pushPublishService with contentTypeId and form value params
     * @param any $event
     * @memberof PushPublishContentTypesDialogComponent
     */
    submitPushAction(_event): void {
        if (this.form.valid) {
            this.pushPublishService
                .pushPublishContent(
                    this.assetIdentifier,
                    this.form.value,
                    !!this.eventData.isBundle
                )
                .subscribe((result: any) => {
                    if (!result.errors) {
                        this.close();
                    } else {
                        this.loggerService.debug(result.errorMessages);
                    }
                });
            this.form.reset();
        }
    }

    /**
     * It submits the form from submit button
     * @memberof PushPublishContentTypesDialogComponent
     */
    submitForm(): void {
        this.formEl.ngSubmit.emit();
    }

    private loadCustomCode(): void {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = this.eventData.customCode;
        Array.from(placeholder.childNodes).forEach((el: HTMLElement) => {
            const parsedEl = this.isScriptElement(el.tagName)
                ? this.createScriptEl(el.innerHTML)
                : el;
            this.renderer.appendChild(this.customCodeContainer.nativeElement, parsedEl);
        });
    }

    private isScriptElement(tag: string): boolean {
        return tag === 'SCRIPT';
    }

    private createScriptEl(content: string): HTMLScriptElement {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'type', 'text/javascript');
        const text = this.renderer.createText(content);
        this.renderer.appendChild(script, text);

        return script;
    }

    private clearCustomCode(): void {
        const childElements = this.customCodeContainer.nativeElement.children;
        for (const child of childElements) {
            this.renderer.removeChild(this.customCodeContainer.nativeElement, child);
        }
    }

    private loadMessagesAndFilters(): void {
        const messages$ = this.dotMessageService.getMessages([
            'contenttypes.content.push_publish',
            'contenttypes.content.push_publish.filters',
            'contenttypes.content.push_publish.action.push',
            'contenttypes.content.push_publish.action.remove',
            'contenttypes.content.push_publish.action.pushremove',
            'contenttypes.content.push_publish.I_want_To',
            'contenttypes.content.push_publish.force_push',
            'contenttypes.content.push_publish.publish_date',
            'contenttypes.content.push_publish.expire_date',
            'contenttypes.content.push_publish.push_to',
            'contenttypes.content.push_publish.push_to_errormsg',
            'contenttypes.content.push_publish.form.cancel',
            'contenttypes.content.push_publish.form.push',
            'contenttypes.content.push_publish.publish_date_errormsg',
            'contenttypes.content.push_publish.expire_date_errormsg'
        ]);
        const filterOptions$ = this.dotPushPublishFiltersService
            .get()
            .pipe(catchError(() => of([])));

        combineLatest(messages$, filterOptions$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (
                    [messages, filterOptions]: [{ [key: string]: string }, DotPushPublishFilter[]]
                ) => {
                    this.i18nMessages = messages;
                    this.filterOptions = filterOptions.map((filter: DotPushPublishFilter) => {
                        return {
                            label: filter.title,
                            value: filter.key
                        };
                    });

                    this.defaultFilterKey = filterOptions
                        .filter((filter: DotPushPublishFilter) => filter.default)
                        .map(({ key }: DotPushPublishFilter) => key)
                        .join();
                }
            );
    }

    private initForm(params?: { [key: string]: any }): void {
        this.form = this.fb.group({
            ...params,
            pushActionSelected: [this.pushActions[0].value, [Validators.required]],
            publishdate: [new Date(), [Validators.required]],
            expiredate: [{ value: new Date(), disabled: true }, [Validators.required]],
            environment: ['', [Validators.required]],
            forcePush: false
        });

        this.form
            .get('pushActionSelected')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((pushActionSelected: string) => {
                switch (pushActionSelected) {
                    case 'publish': {
                        this.form.get('publishdate').enable();
                        this.form.get('expiredate').disable();
                        break;
                    }
                    case 'expire': {
                        this.form.get('publishdate').disable();
                        this.form.get('expiredate').enable();
                        break;
                    }
                    default: {
                        this.form.get('publishdate').enable();
                        this.form.get('expiredate').enable();
                    }
                }
            });
    }

    private getPushPublishActions(messages: { [key: string]: string }): SelectItem[] {
        return [
            {
                label: messages['contenttypes.content.push_publish.action.push'],
                value: 'publish'
            },
            {
                label: messages['contenttypes.content.push_publish.action.remove'],
                value: 'expire',
                disabled: this.isRestrictedOrCategory()
            },
            {
                label: messages['contenttypes.content.push_publish.action.pushremove'],
                value: 'publishexpire',
                disabled: this.eventData.removeOnly || this.isRestrictedOrCategory()
            }
        ];
    }

    private isRestrictedOrCategory(): boolean {
        return this.eventData.restricted || this.eventData.cats;
    }

    private setDialogConfig(messages: { [key: string]: string }, form: FormGroup): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.submitForm();
                },
                label: messages['contenttypes.content.push_publish.form.push'],
                disabled: true
            },
            cancel: {
                action: () => {
                    this.close();
                },
                label: messages['contenttypes.content.push_publish.form.cancel']
            }
        };

        form.valueChanges.subscribe(() => {
            this.dialogActions = {
                ...this.dialogActions,
                accept: {
                    ...this.dialogActions.accept,
                    disabled: !this.form.valid
                }
            };
        });
    }
}
