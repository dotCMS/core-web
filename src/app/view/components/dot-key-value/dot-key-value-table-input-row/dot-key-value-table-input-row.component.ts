import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotMessageSeverity, DotMessageType } from '@components/dot-message-display/model';
import { DotKeyValue } from '@shared/models/dot-key-value/dot-key-value.model';

@Component({
    selector: 'dot-key-value-table-input-row',
    styleUrls: ['./dot-key-value-table-input-row.component.scss'],
    templateUrl: './dot-key-value-table-input-row.component.html'
})
export class DotKeyValueTableInputRowComponent implements OnInit, OnChanges {
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

    rowActiveHighlight: Boolean = false;
    // showEditMenu: Boolean = false;
    saveDisabled: Boolean = false;
    messages: { [key: string]: string } = {};
    elemRef: ElementRef;
    isEditing = false;
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
                // if (!this.isEditing && this.variableIndex === 0) {
                // "setTimeout" needs to be set so "keyCell" DOM gets rendered and tests don't fail
                // setTimeout(() => {
                this.keyCell.nativeElement.focus();
                // }, 0);
                // }
            });
    }

    ngOnChanges(_changes: SimpleChanges) {
        // if (changes.variable) {
        //     this.isEditing = !!changes.variable.currentValue.value;
        // }
    }

    /**
     * Focus on Key input
     * @param {Event} [$event]
     * @memberof DotKeyValueTableInputRowComponent
     */
    // focusKeyInput($event: Event): void {
    //     $event.stopPropagation();
    //     if (this.variableIndex === 0) {
    //         this.keyCell.nativeElement.click();
    //     } else {
    //         this.valueCell.nativeElement.click();
    //     }
    // }

    /**
     * Sets initial fields properties
     *
     * @param {Event} $event
     * @memberof DotKeyValueTableInputRowComponent
     */
    editFieldInit($event?: Event): void {
        // this.rowActiveHighlight = true;
        // this.showEditMenu = true;
        const isKeyVariableDuplicated = this.isFieldVariableKeyDuplicated();
        this.saveDisabled = this.isSaveDisabled(isKeyVariableDuplicated);

        if (this.shouldDisplayDuplicatedVariableError(isKeyVariableDuplicated, $event)) {
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
        // this.showEditMenu = false;
        // this.cancel.emit(this.variableIndex);
    }

    /**
     * Handle Enter key event
     * @param {KeyboardEvent} $event
     * @memberof DotKeyValueTableInputRowComponent
     */
    onPressEnter($event: KeyboardEvent): void {
        if (this.keyInputInvalid($event)) {
            this.elemRef = this.keyCell;
        } else if (this.variable.key !== '') {
            this.getElementToFocus($event);
        }

        setTimeout(() => {
            this.elemRef.nativeElement.click();
        });
    }

    /**
     * Handle Save event emitting variable value to parent component
     * @memberof DotKeyValueTableInputRowComponent
     */
    saveVariable(): void {
        // this.showEditMenu = false;
        this.save.emit(this.variable);
        this.cleanVariableValues();
    }

    private isSaveDisabled(isKeyVariableDuplicated: boolean) {
        return this.isFieldDisabled() || (isKeyVariableDuplicated && !this.isEditing);
    }

    private isFieldDisabled(): boolean {
        return this.variable.key === '' || this.variable.value === '';
    }

    private shouldDisplayDuplicatedVariableError(
        isKeyVariableDuplicated: boolean,
        $event: Event
    ): boolean {
        return isKeyVariableDuplicated && $event && $event.type === 'blur';
    }

    private isFieldVariableKeyDuplicated(): boolean {
        return (
            this.variablesList.filter(
                (variable: DotKeyValue, index: number) =>
                    index !== 0 && variable.key === this.variable.key
            ).length > 0
        );
    }

    private keyInputInvalid($event: KeyboardEvent): boolean {
        return this.variable.key === '' && this.isKeyInput($event);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private getElementToFocus($event: KeyboardEvent): void {
        if (this.isKeyInput($event) || this.variable.value === '') {
            this.elemRef = this.valueCell;
        } else if (this.variable.value !== '') {
            this.elemRef = this.saveButton;
        }
    }

    private isKeyInput($event: KeyboardEvent): boolean {
        const element = <HTMLElement>$event.srcElement;
        return element.classList.contains('field-key-input');
    }

    private cleanVariableValues(): void {
        this.variable = { key: '', hidden: false, value: '' };
        this.saveDisabled = true;
    }
}
