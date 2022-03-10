import { Observable, Subject } from 'rxjs';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotMenuService } from '@dotcms/app/api/services/dot-menu.service';
import { take, takeUntil, tap } from 'rxjs/operators';
import { DotMenu } from '@dotcms/app/shared/models/navigation';
import { DotCMSContentType } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-add-to-menu',
    templateUrl: 'dot-add-to-menu.component.html',
    styleUrls: ['dot-add-to-menu.component.scss']
})
export class DotAddToMenuComponent implements OnInit, OnChanges, OnDestroy {
    form: FormGroup;
    menu$: Observable<DotMenu[]>;
    placeholder = '';
    dialogShow = false;
    dialogActions: DotDialogActions;

    @Input() contentType: DotCMSContentType;

    @Output() cancel = new EventEmitter<boolean>();

    @ViewChild('formEl', { static: true }) formEl: HTMLFormElement;
    @ViewChild('titleName', { static: true }) titleName: ElementRef;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public fb: FormBuilder,
        private dotMessageService: DotMessageService,
        private dotMenuService: DotMenuService
    ) {}

    ngOnInit() {
        this.initForm();
        this.menu$ = this.dotMenuService.loadMenu().pipe(
            take(1),
            tap(() => {
                this.setDialogConfig(this.form);
            })
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.contentType?.currentValue) {
            this.form.patchValue({
                title: this.contentType.name
            });
            setTimeout(() => {
                this.titleName.nativeElement.focus();
            }, 0);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close dialog modal and reset form
     * @memberof DotAddToBundleComponent
     */
    close(): void {
        this.cancel.emit(true);
    }

    /**
     * Add to bundle if form is valid
     * @param {any} $event
     * @memberof DotAddToBundleComponent
     */
    submit(_event): void {
        // if (this.form.valid) {
        //     this.addToBundleService
        //         .addToBundle(this.assetIdentifier, this.setBundleData())
        //         .pipe(takeUntil(this.destroy$))
        //         .subscribe((result: DotAjaxActionResponseView) => {
        //             if (!result.errors) {
        //                 sessionStorage.setItem(
        //                     LAST_BUNDLE_USED,
        //                     JSON.stringify(this.setBundleData())
        //                 );
        //                 this.form.reset();
        //                 this.close();
        //             } else {
        //                 this.loggerService.debug(result.errorMessages);
        //             }
        //         });
        // }
    }

    /**
     * It submits the form from submit button
     * @memberof PushPublishContentTypesDialogComponent
     */
    submitForm(): void {
        this.formEl.ngSubmit.emit();
    }

    private initForm(): void {
        this.form = this.fb.group({
            defaultView: ['list', [Validators.required]],
            menuOption: ['', [Validators.required]],
            title: ['', [Validators.required]]
        });
    }

    private setDialogConfig(form: FormGroup): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.submitForm();
                },
                label: this.dotMessageService.get('add'),
                disabled: !form.valid
            },
            cancel: {
                action: () => {
                    this.close();
                },
                label: this.dotMessageService.get('cancel')
            }
        };

        form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            console.log('*** form', data);
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
