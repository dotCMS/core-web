import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Method,
    Prop,
    State,
    Watch
} from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotBinaryFieldValueEvent,
    DotBinaryTextStatusEvent,
    DotFieldStatus,
    DotFieldStatusEvent,
    DotFieldValueEvent,
    DotInputCalendarStatusEvent
} from '../../models';
import {
    checkProp,
    getClassNames,
    getErrorClass,
    getHintId,
    getId,
    getOriginalStatus,
    getTagError,
    getTagHint,
    updateStatus
} from '../../utils';
import { type } from 'os';
import { isFileAllowed } from './dot-binary-helper/dot-binary-helper';
import { Components } from '../../components';
import DotBinaryTextField = Components.DotBinaryTextField;

/**
 * Represent a dotcms binary file control.
 *
 * @export
 * @class DotBinaryFile
 */
@Component({
    tag: 'dot-binary-file',
    styleUrl: 'dot-binary-file.scss'
})
export class DotBinaryFileComponent {
    @Element() el: HTMLElement;

    /** Value specifies the value of the <input> element */
    @Prop({ mutable: true })
    value = null;

    /** Name that will be used as ID */
    @Prop() name = '';

    /** (optional) Text to be rendered next to input field */
    @Prop({ reflectToAttr: true })
    label = '';

    /** (optional) Placeholder specifies a short hint that describes the expected value of the input field */
    @Prop({ reflectToAttr: true })
    placeholder = 'Attach files by dragging & dropping, selecting or pasting them.';

    /** (optional) Hint text that suggest a clue of the field */
    @Prop({ reflectToAttr: true })
    hint = '';

    /** (optional) Determine if it is mandatory */
    @Prop({ reflectToAttr: true })
    required = false;

    /** (optional) Text that be shown when required is set and condition not met */
    @Prop() requiredMessage = 'This field is required';

    /** (optional) Text that be shown when the Regular Expression condition not met */
    @Prop() validationMessage = "The field doesn't comply with the specified format";

    @Prop() URLValidationMessage = 'The specified URL is not valid';

    /** (optional) Disables field's interaction */
    @Prop({ reflectToAttr: true })
    disabled = false;

    /** (optional) Describes a type of file that may be selected by the user, separated by comma  eg: .pdf,.jpg  */
    @Prop({ reflectToAttr: true })
    accept = '';

    /** (optional) Text that be shown in the browse file button */
    @Prop({ reflectToAttr: true })
    buttonLabel = 'Browse';

    @State() status: DotFieldStatus;
    @State() errorElement: JSX.Element = null;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    private allowedFileTypes = [];
    private binaryTextValue = '';
    private errorMessage = '';
    private binaryTextField: DotBinaryTextField;

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.value = '';
        this.binaryTextField.reset();
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this.validateProps();
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
    }

    componentDidLoad(): void {
        this.binaryTextField = this.el.querySelector('dot-binary-text-field');
    }

    @Watch('accept')
    optionsWatch(): void {
        const validTypes = checkProp<DotBinaryFileComponent, string>(this, 'accept');
        this.allowedFileTypes = !!validTypes ? validTypes.split(',') : [];
    }

    @Listen('_valueChange')
    binaryTextValueChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.setFileDisplayName(this.binaryTextField.value);
        const eventValue: DotFieldValueEvent = event.detail;
        this.setValue(eventValue.value);
    }

    @Listen('_statusChange')
    binaryTextStatusChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        const statusEvent: DotBinaryTextStatusEvent = event.detail;
        this.errorMessage = statusEvent.errorType;
        this.status = statusEvent.status;
        if (this.status.dotPristine && this.status.dotTouched) {
            this.emitStatusChange();
        }
    }

    @Listen('dragover')
    HandleDragover(): void {
        if (!this.disabled) {
            this.el.classList.add('dot-dragover');
            this.el.classList.remove('dot-dropped');
        }
    }

    @Listen('dragleave')
    HandleDragleave(): void {
        this.el.classList.remove('dot-dragover');
        this.el.classList.remove('dot-dropped');
    }

    @Listen('drop', { passive: false })
    HandleDrop(evt: DragEvent): void {
        evt.preventDefault();
        if (!this.disabled) {
            this.el.classList.add('dot-dropped');
            this.el.classList.remove('dot-dragover');
            this.errorMessage = '';
            const droppedFile: File = evt.dataTransfer.files[0];
            if (isFileAllowed(droppedFile.name, this.allowedFileTypes)) {
                this.setValue(droppedFile);
                this.setFileDisplayName(droppedFile.name);
            } else {
                this.errorMessage = 'validationMessage';
                this.setValue(null);
            }
        }
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    render() {
        return (
            <Fragment>
                <dot-label
                    label={this.label}
                    required={this.required}
                    name={this.name}
                    tabindex="0"
                >
                    <dot-binary-text-field
                        name={this.name}
                        placeholder={this.placeholder}
                        required={this.required}
                        disabled={this.disabled}
                        value={this.binaryTextValue}
                        accept={this.allowedFileTypes}
                    />
                    <input
                        aria-describedby={getHintId(this.hint)}
                        class={getErrorClass(this.status.dotValid)}
                        disabled={this.disabled}
                        id={getId(this.name)}
                        onChange={(event: Event) => this.fileChangeHandler(event)}
                        required={this.required || null}
                        type="file"
                        accept={this.accept}
                        value={this.value}
                    />
                    <button disabled={this.disabled} onClick={() => this.buttonHandler()}>
                        {this.buttonLabel}
                    </button>
                </dot-label>
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private fileChangeHandler(event: Event): void {
        const input: HTMLInputElement = event.srcElement as HTMLInputElement;
        this.errorMessage = '';
        if (isFileAllowed(input.files[0].name, this.allowedFileTypes)) {
            this.setValue(input.files[0]);
            this.setFileDisplayName(input.files[0].name);
        } else {
            event.preventDefault();
            this.errorMessage = 'validationMessage';
            this.setValue(null);
            this.setFileDisplayName('');
        }
    }

    private buttonHandler(): void {
        const fileInput: HTMLInputElement = this.el.querySelector('dot-label input[type="file"]');
        fileInput.click();
    }

    private setFileDisplayName(name: string): void {
        this.binaryTextValue = name;
    }

    private validateProps(): void {
        this.optionsWatch();
    }

    private shouldShowErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this[this.errorMessage];
    }

    private isValid(): boolean {
        return !(this.required && !this.value);
    }

    private setValue(data: File | string): void {
        this.value = data;
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        debugger;
        this.binaryTextValue = data === null ? '' : this.binaryTextValue;
        this.emitValueChange();
        this.emitStatusChange();
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private emitValueChange(): void {
        this.valueChange.emit({
            name: this.name,
            value: this.value
        });
    }
}
