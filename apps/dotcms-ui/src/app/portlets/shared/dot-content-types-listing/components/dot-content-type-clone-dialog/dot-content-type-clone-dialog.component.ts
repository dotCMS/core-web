import {
    AfterViewChecked,
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotCloneContentTypeDialogFormFields } from '@dotcms/dotcms-models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DotCMSAssetDialogCloneFields } from '@portlets/shared/dot-content-types-listing/dot-content-type.store';

@Component({
    selector: 'dot-content-type-clone-dialog',
    templateUrl: './dot-content-type-clone-dialog.component.html',
    styleUrls: ['./dot-content-type-clone-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotContentTypeCloneDialogComponent implements OnInit, OnDestroy, AfterViewChecked {
    dialogActions: DotDialogActions;
    inputNameWithType = '';
    @Input()
    isVisibleDialog = false;
    @Input()
    isSaving = false;
    @Output() cancelBtn = new EventEmitter<boolean>();

    @Output()
    validFormFields = new EventEmitter<DotCloneContentTypeDialogFormFields>();
    form!: FormGroup;

    asset: DotCMSAssetDialogCloneFields;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly dotMessageService: DotMessageService,
        private readonly cd: ChangeDetectorRef
    ) {
        this.initForm();
    }

    @Input()
    set assetSelected(assetSelected: DotCMSAssetDialogCloneFields | null) {
        if (assetSelected) {
            this.asset = assetSelected;
            this.inputNameWithType = this.getNameFieldLabel(assetSelected.baseType);
            this.patchForm(assetSelected.data);
        }
    }

    ngOnInit(): void {
        this.setDialogConfig();
    }

    submitForm() {
        if (this.form.valid) {
            this.validFormFields.emit(this.form.value);
        }
    }

    closeDialog(): void {
        this.cancelBtn.emit(true);
        this.initForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    ngAfterViewChecked() {
        this.cd.markForCheck();
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
