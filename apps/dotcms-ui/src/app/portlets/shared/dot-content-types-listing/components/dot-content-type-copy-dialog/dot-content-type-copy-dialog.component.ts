import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotCopyContentTypeDialogFormFields } from '@dotcms/dotcms-models';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DotCMSAssetDialogCopyFields } from '@portlets/shared/dot-content-types-listing/dot-content-type.store';

@Component({
    selector: 'dot-content-type-copy-dialog',
    templateUrl: './dot-content-type-copy-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotContentTypeCopyDialogComponent implements OnInit, OnDestroy {
    dialogActions: DotDialogActions;
    inputNameWithType = '';
    dialogTitle = '';

    @Input()
    isVisibleDialog = false;
    @Input()
    isSaving$ = new Observable<boolean>();
    @Output() cancelBtn = new EventEmitter<boolean>();

    @Output()
    validFormFields = new EventEmitter<DotCopyContentTypeDialogFormFields>();
    form!: FormGroup;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly dotMessageService: DotMessageService,
        private readonly cd: ChangeDetectorRef
    ) {
        this.initForm();
    }

    get variableControl() {
        return this.form.get('variable') as FormControl;
    }

    get nameControl() {
        return this.form.get('name') as FormControl;
    }

    openDialog(config: DotCMSAssetDialogCopyFields) {
        this.inputNameWithType = this.getNameFieldLabel(config.baseType);
        this.dialogTitle = config.title;
        this.isVisibleDialog = true;
        if (config.data) {
            this.patchForm(config.data);
        }
    }

    ngOnInit(): void {
        this.setDialogConfig();
    }

    /**
     * Emit all the values of the form only if all valid
     *
     * @memberof DotContentTypeCopyDialogComponent
     */
    submitForm() {
        if (this.form.valid) {
            this.validFormFields.emit(this.form.value);
        }
    }

    /**
     * Emit the action of close dialog
     *
     * @memberof DotContentTypeCopyDialogComponent
     */
    closeDialog(): void {
        this.cancelBtn.emit(true);
        this.initForm();
        this.isVisibleDialog = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private setDialogConfig(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    this.submitForm();
                },
                label: this.dotMessageService.get('contenttypes.content.copy'),
                disabled: !this.form.valid
            },
            cancel: {
                action: () => {
                    this.closeDialog();
                },
                label: this.dotMessageService.get('contenttypes.content.add_to_bundle.form.cancel')
            }
        };

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dialogActions = {
                ...this.dialogActions,
                accept: {
                    ...this.dialogActions.accept,
                    disabled: !this.form.valid
                }
            };
        });
    }

    private initForm(): void {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            variable: [''],
            folder: [''],
            host: [''],
            icon: ['']
        });
    }

    private getNameFieldLabel(type: string): string {
        return `${this.dotMessageService.get(
            `contenttypes.content.${type.toLowerCase()}`
        )} ${this.dotMessageService.get('contenttypes.form.name')}`;
    }

    private patchForm(formData: { icon: string; host: string }) {
        this.form.patchValue(formData);
    }
}
