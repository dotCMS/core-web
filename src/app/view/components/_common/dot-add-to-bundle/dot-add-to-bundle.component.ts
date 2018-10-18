import { Observable, Subject } from 'rxjs';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DotMessageService } from '@services/dot-messages-service';
import { LoggerService } from 'dotcms-js/dotcms-js';
import { AddToBundleService } from '@services/add-to-bundle/add-to-bundle.service';
import { DotBundle } from '@models/dot-bundle/dot-bundle';
import { Dropdown } from 'primeng/primeng';
import { mergeMap, map, tap, take, takeUntil } from 'rxjs/operators';
import { DotDialogAction } from '@components/dot-dialog/dot-dialog.component';

const LAST_BUNDLE_USED = 'lastBundleUsed';

@Component({
    selector: 'dot-add-to-bundle',
    templateUrl: 'dot-add-to-bundle.component.html',
    styleUrls: ['dot-add-to-bundle.component.scss']
})
export class DotAddToBundleComponent implements OnInit, AfterViewInit, OnDestroy {
    form: FormGroup;
    bundle$: Observable<DotBundle[]>;
    placeholder = '';
    okDialogAction: DotDialogAction;
    cancelDialogAction: DotDialogAction;
    dialogShow = false;

    @Input()
    assetIdentifier: string;

    @Output()
    cancel = new EventEmitter<boolean>();

    @ViewChild('formEl')
    formEl: HTMLFormElement;

    @ViewChild('addBundleDropdown')
    addBundleDropdown: Dropdown;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private addToBundleService: AddToBundleService,
        public fb: FormBuilder,
        public dotMessageService: DotMessageService,
        public loggerService: LoggerService
    ) {}

    ngOnInit() {
        const keys = [
            'contenttypes.content.add_to_bundle',
            'contenttypes.content.add_to_bundle.select',
            'contenttypes.content.add_to_bundle.type',
            'contenttypes.content.add_to_bundle.errormsg',
            'contenttypes.content.add_to_bundle.form.cancel',
            'contenttypes.content.add_to_bundle.form.add'
        ];

        this.initForm();

        this.bundle$ = this.dotMessageService.getMessages(keys).pipe(
            take(1),
            mergeMap((messages) => {
                return this.addToBundleService.getBundles().pipe(
                    take(1),
                    map((bundles: DotBundle[]) => {
                        setTimeout(() => {
                            this.placeholder = bundles.length
                                ? messages['contenttypes.content.add_to_bundle.select']
                                : messages['contenttypes.content.add_to_bundle.type'];
                        }, 0);

                        this.form
                            .get('addBundle')
                            .setValue(
                                this.getDefaultBundle(bundles)
                                    ? this.getDefaultBundle(bundles).name
                                    : ''
                            );
                        return bundles;
                    }),
                    tap(() => {
                        this.setDialogConfig(messages, this.form);
                        this.dialogShow = true;
                    })
                );
            })
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.addBundleDropdown.editableInputViewChild.nativeElement.focus();
        });
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
        this.initForm();
    }

    /**
     * Add to bundle if form is valid
     * @param {any} $event
     * @memberof DotAddToBundleComponent
     */
    submitBundle(_event): void {
        if (this.form.valid) {
            this.addToBundleService
                .addToBundle(this.assetIdentifier, this.setBundleData())
                .pipe(takeUntil(this.destroy$))
                .subscribe((result: any) => {
                    if (!result.errors) {
                        sessionStorage.setItem(
                            LAST_BUNDLE_USED,
                            JSON.stringify(this.setBundleData())
                        );
                        this.form.reset();
                        this.close();
                    } else {
                        this.loggerService.debug(result.errorMessages);
                    }
                });
        }
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
            addBundle: ['', [Validators.required]]
        });
    }

    private setBundleData(): DotBundle {
        if (typeof this.form.value.addBundle === 'string') {
            return {
                id: this.form.value.addBundle,
                name: this.form.value.addBundle
            };
        } else {
            return this.form.value.addBundle;
        }
    }

    private getDefaultBundle(bundles: DotBundle[]): DotBundle {
        const lastBundle: DotBundle = JSON.parse(sessionStorage.getItem(LAST_BUNDLE_USED));
        // return lastBundle ? this.bundle$.find(bundle => bundle.name === lastBundle.name) : null;
        return lastBundle ? bundles.find((bundle) => bundle.name === lastBundle.name) : null;
    }

    private setDialogConfig(messages, form: FormGroup): void {
        this.okDialogAction = {
            action: () => {
                this.submitForm();
            },
            label: messages['contenttypes.content.add_to_bundle.form.add'],
            disabled: !form.valid
        };

        this.cancelDialogAction = {
            action: () => {
                this.close();
            },
            label: messages['contenttypes.content.add_to_bundle.form.cancel']
        };

        form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.okDialogAction = {
                ...this.okDialogAction,
                disabled: !this.form.valid
            };
        });
    }
}
