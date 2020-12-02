import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotCrudService } from '@services/dot-crud';
import {
    DotCMSTempFile,
    DotTempFileUploadService
} from '@services/dot-temp-file-upload/dot-temp-file-upload.service';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';
import { DotCMSContentlet } from 'dotcms-models';
import { finalize, switchMap, take } from 'rxjs/operators';

export interface DotCMSTemplateThumbnail extends DotCMSContentlet {
    assetVersion: string;
    name: string;
}

@Component({
    selector: 'dot-template-thumbnail-field',
    templateUrl: './dot-template-thumbnail-field.component.html',
    styleUrls: ['./dot-template-thumbnail-field.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotTemplateThumbnailFieldComponent)
        }
    ]
})
export class DotTemplateThumbnailFieldComponent implements OnInit, ControlValueAccessor {
    asset: DotCMSTemplateThumbnail;
    loading = false;

    identifier: string;

    constructor(
        private dotTempFileUploadService: DotTempFileUploadService,
        private dotWorkflowActionsFireService: DotWorkflowActionsFireService,
        private dotCrudService: DotCrudService
    ) {}

    ngOnInit(): void {}

    /**
     * Habdle thumbnail setup
     *
     * @param {CustomEvent<{ name: string; value: File }>} { detail: { value } }
     * @memberof DotTemplateThumbnailFieldComponent
     */
    onThumbnailChange({ detail: { value } }: CustomEvent<{ name: string; value: File }>) {
        console.log('value', value);
        if (value) {
            this.loading = true;
            this.dotTempFileUploadService
                .upload(value)
                .pipe(
                    switchMap(([{ id }]: DotCMSTempFile[]) => {
                        return this.dotWorkflowActionsFireService.publishContentletAndWaitForIndex(
                            'dotAsset',
                            {
                                asset: id
                            }
                        );
                    }),
                    take(1)
                )
                .subscribe((res: DotCMSTemplateThumbnail) => {
                    this.loading = false;
                    this.asset = res;
                    this.propagateChange(this.asset.identifier);
                });
        } else {
            this.asset = null;
            this.propagateChange('');
        }
    }

    propagateChange = (_: any) => {};

    writeValue(id: string): void {
        this.identifier = id;
        this.loading = true;

        this.dotCrudService
            .getDataById('/api/content', id, 'contentlets')
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                take(1)
            )
            .subscribe(
                ([contentlet]: DotCMSTemplateThumbnail[]) => {
                    this.asset = contentlet;
                },
                () => {
                    // do nothing, failing silently
                }
            );
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
