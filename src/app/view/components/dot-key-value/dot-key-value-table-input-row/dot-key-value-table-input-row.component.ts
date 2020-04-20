import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef
} from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotMessageSeverity, DotMessageType } from '@components/dot-message-display/model';
import { DotKeyValue } from '@shared/models/dot-key-value/dot-key-value.model';
import { DotKeyValueUtil } from '../util/dot-key-value-util';

@Component({
    selector: 'dot-key-value-table-input-row',
    styleUrls: ['./dot-key-value-table-input-row.component.scss'],
    templateUrl: './dot-key-value-table-input-row.component.html'
})
export class DotKeyValueTableInputRowComponent implements OnInit {
    @ViewChild('saveButton')
    saveButton: ElementRef;
    @ViewChild('keyCell')
    keyCell: ElementRef;
    @ViewChild('valueCell')
    valueCell: ElementRef;

    @Input() showHiddenField: boolean;
    @Input()
    variablesList: DotKeyValue[] = [];

    @Output()
    save: EventEmitter<DotKeyValue> = new EventEmitter(false);

    saveDisabled: Boolean = false;
    messages: { [key: string]: string } = {};
    elemRef: ElementRef;
    variable: DotKeyValue = { key: '', hidden: false, value: '' };

    constructor(
        public dotMessageService: DotMessageService,
        private dotMessageDisplayService: DotMessageDisplayService
    ) {}

    ngOnInit(): void {
        this.dotMessageService
            .getMessages([
                'keyValue.key_input.placeholder',
                'keyValue.value_input.placeholder',
                'Save',
                'Cancel',
                'keyValue.error.duplicated.variable'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
                this.keyCell.nativeElement.focus();
            });
    }

    /**
     * Sets initial fields properties
     *
     * @param {Event} $event
     * @memberof DotKeyValueTableInputRowComponent
     */
    editFieldInit($event?: Event): void {
        const isKeyVariableDuplicated = DotKeyValueUtil.isFieldVariableKeyDuplicated(
            this.variable,
            this.variablesList,
            true
        );
        this.saveDisabled = DotKeyValueUtil.isSaveDisabled(isKeyVariableDuplicated, this.variable);

        if (DotKeyValueUtil.shouldDisplayDuplicatedVariableError(isKeyVariableDuplicated, $event)) {
            this.dotMessageDisplayService.push({
                life: 3000,
                message: this.messages['keyValue.error.duplicated.variable'].replace(
                    '{0}',
                    (<HTMLInputElement>$event.target).value
                ),
                severity: DotMessageSeverity.ERROR,
                type: DotMessageType.SIMPLE_MESSAGE
            });
        }
    }

    /**
     * Handle Cancel event event emmitting variable index to parent component
     * @param {KeyboardEvent} $event
     * @memberof DotKeyValueTableInputRowComponent
     */
    onCancel($event: KeyboardEvent): void {
        $event.stopPropagation();
        this.cleanVariableValues();
        this.keyCell.nativeElement.focus();
    }

    /**
     * Handle Enter key event
     * @param {KeyboardEvent} $event
     * @memberof DotKeyValueTableInputRowComponent
     */
    onPressEnter($event: KeyboardEvent): void {
        if (DotKeyValueUtil.keyInputInvalid($event, this.variable)) {
            this.elemRef = this.keyCell;
        } else if (this.variable.key !== '') {
            this.getElementToFocus($event);
        }
        setTimeout(() => {
            this.elemRef.nativeElement.type === 'text'
                ? this.elemRef.nativeElement.focus()
                : this.elemRef.nativeElement.click();
        });
    }

    /**
     * Handle Save event emitting variable value to parent component
     * @memberof DotKeyValueTableInputRowComponent
     */
    saveVariable(): void {
        this.save.emit(this.variable);
        this.cleanVariableValues();
        this.keyCell.nativeElement.focus();
    }

    private getElementToFocus($event: KeyboardEvent): void {
        if (DotKeyValueUtil.isKeyInput($event) || this.variable.value === '') {
            this.elemRef = this.valueCell;
        } else {
            this.elemRef = this.saveButton;
        }
    }

    private cleanVariableValues(): void {
        this.variable = { key: '', hidden: false, value: '' };
        this.saveDisabled = true;
    }
}
