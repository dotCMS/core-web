import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotCreatePersonaFormComponent } from '@components/dot-add-persona-dialog/dot-create-persona-form/dot-create-persona-form.component';
import { FormGroup } from '@angular/forms';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotActionService } from '@services/dot-action/dot-action.service';

@Component({
    selector: 'dot-add-persona-dialog',
    templateUrl: './dot-add-persona-dialog.component.html',
    styleUrls: ['./dot-add-persona-dialog.component.scss']
})
export class DotAddPersonaDialogComponent implements OnInit {
    @Input() visible = true;
    @Input() action: (action: any) => void;
    @Output() persona: EventEmitter<DotPersona> = new EventEmitter();
    @ViewChild('createPersonaForm') createPersonaForm: DotCreatePersonaFormComponent;

    messagesKey: { [key: string]: string } = {};
    dialogActions: DotDialogActions;

    constructor(
        public dotMessageService: DotMessageService,
        public dotActionService: DotActionService
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
                            this.visible = false;
                        }
                    }
                };
            });
    }

    savePersona(): void {
        if (this.createPersonaForm.form) {
            this.dotActionService
                .new(this.createPersonaForm.form.getRawValue())
                .pipe(take(1))
                .subscribe((persona: DotPersona) => {
                    this.persona.emit(persona);
                    this.visible = false;
                });
        }
    }

    formValueHandler(form: FormGroup): void {
        this.dialogActions = {
            ...this.dialogActions,
            accept: {
                ...this.dialogActions.accept,
                disabled: !form.valid
            }
        };
    }
}
