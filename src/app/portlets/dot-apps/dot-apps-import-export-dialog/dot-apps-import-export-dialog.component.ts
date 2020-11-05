import {
    Component,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import {
    DotApps,
    DotAppsExportConfiguration,
    DotAppsImportConfiguration,
    DotAppsSites
} from '@shared/models/dot-apps/dot-apps.model';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'dot-apps-import-export-dialog',
    templateUrl: './dot-apps-import-export-dialog.component.html'
})
export class DotAppsImportExportDialogComponent implements OnChanges, OnDestroy {
    @ViewChild('importFile') importFile: ElementRef;
    @Input() action?: string;
    @Input() app?: DotApps;
    @Input() site?: DotAppsSites;
    @Output() resolved: EventEmitter<boolean> = new EventEmitter();

    showExportDialog = false;
    form: FormGroup;
    dialogActions: DotDialogActions;
    errorMessage: string;
    dialogHeaderKey = '';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotAppsService: DotAppsService,
        private dotMessageService: DotMessageService,
        private fb: FormBuilder
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.action?.currentValue) {
            this.setDialogForm(changes.action.currentValue);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close the dialog and clear the form
     *
     * @memberof DotAppsConfigurationComponent
     */
    closeExportDialog(): void {
        this.errorMessage = '';
        this.form.reset();
        this.site = null;
        this.showExportDialog = false;
    }

    /**
     * Updates form control value for inputFile field
     *
     * @param { File[] } files
     * @memberof DotAppsConfigurationComponent
     */
    onFileChange(files: File[]) {
        this.form.controls['importFile'].setValue(files[0] ? files[0].name : '');
    }

    /**
     * Sets dialog form based on action Import/Export
     *
     * @param { string } action
     * @memberof DotAppsConfigurationComponent
     */
    setDialogForm(action: string): void {
        if (action === 'Export') {
            this.dialogHeaderKey = 'apps.confirmation.export.header';
            this.form = this.fb.group({
                password: new FormControl('', Validators.required)
            });
            this.setExportDialogActions();
        } else if (action === 'Import') {
            this.dialogHeaderKey = 'apps.confirmation.import.header';
            this.form = this.fb.group({
                password: new FormControl('', Validators.required),
                importFile: new FormControl('', Validators.required)
            });
            this.setImportDialogActions();
        }

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

    private setExportDialogActions(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    const requestConfiguration: DotAppsExportConfiguration = {
                        password: this.form.value.password,
                        exportAll: this.app ? false : true,
                        appKeysBySite: this.site
                            ? { [this.site.id]: [this.app.key] }
                            : this.getAllKeySitesConfig()
                    };

                    this.dotAppsService
                        .exportConfiguration(requestConfiguration)
                        .then((errorMsg: string) => {
                            if (errorMsg) {
                                this.errorMessage = this.dotMessageService.get(
                                    'apps.confirmation.export.error'
                                );
                            } else {
                                this.closeExportDialog();
                            }
                        });
                },
                label: this.dotMessageService.get('dot.common.dialog.accept'),
                disabled: true
            },
            cancel: {
                label: this.dotMessageService.get('dot.common.dialog.reject'),
                action: () => {
                    this.closeExportDialog();
                }
            }
        };
    }

    private setImportDialogActions(): void {
        this.dialogActions = {
            accept: {
                action: () => {
                    const requestConfiguration: DotAppsImportConfiguration = {
                        file: this.importFile.nativeElement.files[0],
                        json: { password: this.form.value.password }
                    };

                    this.dotAppsService
                        .importConfiguration(requestConfiguration)
                        .pipe(take(1))
                        .subscribe((status: string) => {
                            if (status !== '400') {
                                this.resolved.emit(true);
                            }
                            this.closeExportDialog();
                        });
                },
                label: this.dotMessageService.get('dot.common.dialog.accept'),
                disabled: true
            },
            cancel: {
                label: this.dotMessageService.get('dot.common.dialog.reject'),
                action: () => {
                    this.closeExportDialog();
                }
            }
        };
    }

    private getAllKeySitesConfig(): { [key: string]: string[] } {
        const keySitesConf = {};
        if (this.app) {
            this.app.sites.forEach((site: DotAppsSites) => {
                if (site.configured) {
                    keySitesConf[site.id] = [this.app.key];
                }
            });
        }
        return keySitesConf;
    }
}
