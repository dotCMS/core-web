import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DotMessageService } from '@services/dot-messages-service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { DotFileUpload } from '@models/dot-file-upload/dot-file-upload.model';
import { DotCMSTempFile } from 'dotcms-models';
import { SiteService } from 'dotcms-js';
import { DotTag } from '@models/dot-tag';

@Component({
    selector: 'dot-create-persona-form',
    templateUrl: './dot-create-persona-form.component.html',
    styleUrls: ['./dot-create-persona-form.component.scss']
})
export class DotCreatePersonaFormComponent implements OnInit, OnDestroy {
    @Input() personaName = '';
    @Output() isValid: EventEmitter<Boolean> = new EventEmitter();

    form: FormGroup;
    tempUploadedFile: DotCMSTempFile;
    messagesKey: { [key: string]: string } = {};
    filteredTags: DotTag[];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public dotMessageService: DotMessageService,
        private fb: FormBuilder,
        private siteService: SiteService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'modes.persona.upload.file',
                'modes.persona.name',
                'modes.persona.key.tag',
                'dot.common.choose',
                'dot.common.remove',
                'modes.persona.host',
                'modes.persona.name.error.required',
                'modes.persona.other.tags'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
        this.initPersonaForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle the response of the p-fileUpload to update the form.
     *
     * @param {DotFileUpload} event
     * @memberof DotCreatePersonaFormComponent
     */
    onFileUpload(event: DotFileUpload) {
        const response = JSON.parse(event.xhr.response);
        this.tempUploadedFile = response.tempFiles[0];
        this.form.get('photo').setValue(this.tempUploadedFile.id);
    }

    /**
     * Remove selected image.
     *
     * @memberof DotCreatePersonaFormComponent
     */
    removeImage(): void {
        this.tempUploadedFile = null;
        this.form.get('photo').setValue('');
    }

    /**
     * Set the key tag attribute with camelCase standard based on the name.
     *
     * @memberof DotCreatePersonaFormComponent
     */
    setKeyTag(): void {
        this.form.get('keyTag').setValue(_.camelCase(this.form.get('name').value));
    }

    /**
     * Reset form to default values
     *
     * @memberof DotCreatePersonaFormComponent
     */
    resetForm(): void {
        this.tempUploadedFile = null;
        this.form.reset();
        this.form.get('hostFolder').setValue(this.siteService.currentSite.identifier);
    }

    updateTags(tags: DotTag[]): void {
        this.form.get('tags').setValue(tags.join(','));
    }

    private initPersonaForm(): void {
        this.form = this.fb.group({
            hostFolder: [this.siteService.currentSite.identifier, [Validators.required]],
            keyTag: [{ value: '', disabled: true }, [Validators.required]],
            name: [this.personaName, [Validators.required]],
            photo: null,
            tags: []
        });
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isValid.emit(this.form.valid);
        });
        this.setKeyTag();
    }
}
