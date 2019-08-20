import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotCreatePersonaFormComponent } from '@components/dot-add-persona-dialog/dot-create-persona-form/dot-create-persona-form.component';
import { FormGroup } from '@angular/forms';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';

@Component({
    selector: 'dot-add-persona-dialog',
    templateUrl: './dot-add-persona-dialog.component.html',
    styleUrls: ['./dot-add-persona-dialog.component.scss']
})
export class DotAddPersonaDialogComponent implements OnInit {
    @Input() visible = false;
    @Output() persona: EventEmitter<DotPersona> = new EventEmitter();
    @ViewChild('personaForm') personaForm: DotCreatePersonaFormComponent;

    messagesKey: { [key: string]: string } = {};
    dialogActions: DotDialogActions;

    constructor(
        public dotMessageService: DotMessageService,
        public dotWorkflowActionsFireService: DotWorkflowActionsFireService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'modes.persona.add.persona',
                'dot.common.dialog.accept',
                'dot.common.dialog.reject'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;

                this.dialogActions = {
                    accept: {
                        action: () => {
                            this.savePersona();
                        },
                        label: this.messagesKey['dot.common.dialog.accept'],
                        disabled: true
                    },
                    cancel: {
                        label: this.messagesKey['dot.common.dialog.reject'],
                        action: () => {
                            this.closeDialog();
                        }
                    }
                };
            });
    }

    /**
     * Call endpoint to safe the persona and emit the value.
     *
     * @memberof DotAddPersonaDialogComponent
     */
    savePersona(): void {
        if (this.personaForm.form.valid) {
            this.dotWorkflowActionsFireService
                .new<DotPersona>(this.personaForm.form.getRawValue())
                .pipe(take(1))
                .subscribe((persona: DotPersona) => {
                    this.persona.emit(persona);
                    this.closeDialog();
                });
        }
    }

    /**
     * Handle changes in the form to set the disable state of the accept button
     *
     * @param {FormGroup} form
     *
     * @memberof DotAddPersonaDialogComponent
     */
    formValueHandler(form: FormGroup): void {
        this.dialogActions = {
            ...this.dialogActions,
            accept: {
                ...this.dialogActions.accept,
                disabled: !form.valid
            }
        };
    }

    /**
     * Close the dialog and clear the form
     *
     * @memberof DotAddPersonaDialogComponent
     */
    closeDialog(): void {
        this.visible = false;
        this.personaForm.resetForm();
        this.dialogActions.accept.disabled = true;
    }
}
