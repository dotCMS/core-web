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
    DotBinaryFileEvent,
    DotFieldStatus,
    DotFieldStatusEvent,
    DotFieldValueEvent
} from '../../models';
import {
    checkProp,
    DotBinaryMessageError,
    getClassNames,
    getOriginalStatus,
    getTagError,
    getTagHint,
    isFileAllowed,
    updateStatus
} from '../../utils';

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

    /** Name that will be used as ID */
    @Prop({ reflectToAttr: true })
    name = '';

    /** (optional) Text to be rendered next to input field */
    @Prop({ reflectToAttr: true })
    label = '';

    /** (optional) Placeholder specifies a short hint that describes the expected value of the input field */
    @Prop({ reflectToAttr: true })
    placeholder = 'Drop or paste a file or url';

    /** (optional) Hint text that suggest a clue of the field */
    @Prop({ reflectToAttr: true })
    hint = '';

    /** (optional) Determine if it is mandatory */
    @Prop({ reflectToAttr: true })
    required = false;

    /** (optional) Text that be shown when required is set and condition not met */
    @Prop() requiredMessage = 'This field is required';

    /** (optional) Text that be shown when the Regular Expression condition not met */
    @Prop() validationMessage = 'The field doesn\'t comply with the specified format';

    /** (optional) Text that be shown when the URL is not valid */
    @Prop() URLValidationMessage = 'The specified URL is not valid';

    /** (optional) Disables field's interaction */
    @Prop({ reflectToAttr: true })
    disabled = false;

    /** (optional) Describes a type of file that may be selected by the user, separated by comma  eg: .pdf,.jpg  */
    @Prop({ reflectToAttr: true, mutable: true })
    accept = '';

    /** (optional) Text that be shown in the browse file button */
    @Prop({ reflectToAttr: true })
    buttonLabel = 'Browse';

    @State() status: DotFieldStatus;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    private value = null;
    private allowedFileTypes = [];
    private errorType: DotBinaryMessageError;
    private binaryTextField: DotBinaryTextField;
    private errorMessageMap = new Map<DotBinaryMessageError, string>();

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.value = '';
        this.binaryTextField.value = '';
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this.setErrorMessageMap();
        this.validateProps();
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
    }

    componentDidLoad(): void {
        this.binaryTextField = this.el.querySelector('dot-binary-text-field');
    }

    @Watch('requiredMessage')
    requiredMessageWatch(): void {
        this.errorMessageMap.set(DotBinaryMessageError.REQUIRED, this.requiredMessage);
    }

    @Watch('validationMessage')
    validationMessageWatch(): void {
        this.errorMessageMap.set(DotBinaryMessageError.INVALID, this.validationMessage);
    }

    @Watch('URLValidationMessage')
    URLValidationMessageWatch(): void {
        this.errorMessageMap.set(DotBinaryMessageError.URLINVALID, this.URLValidationMessage);
    }

    @Watch('accept')
    optionsWatch(): void {
        this.accept = checkProp<DotBinaryFileComponent, string>(this, 'accept');
        this.allowedFileTypes = !!this.accept ? this.accept.split(',') : [];
    }

    @Listen('fileChange')
    fileChangeHandler(event: CustomEvent): void {
        event.stopImmediatePropagation();
        const fileEvent: DotBinaryFileEvent = event.detail;
        this.errorType = fileEvent.errorType;
        this.setValue(fileEvent.file);
        if (this.isBinaryUploadButtonEvent(event.target as Element) && fileEvent.file) {
            this.binaryTextField.value = (fileEvent.file as File).name;
        }
    }

    @Listen('onBlur')
    blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    @Listen('dragover', { passive: false })
    HandleDragover(evt: DragEvent): void {
        evt.preventDefault();
        if (!this.disabled) {
            this.el.classList.add('dot-dragover');
            this.el.classList.remove('dot-dropped');
        }
    }

    @Listen('dragleave', { passive: false })
    HandleDragleave(evt: DragEvent): void {
        evt.preventDefault();
        this.el.classList.remove('dot-dragover');
        this.el.classList.remove('dot-dropped');
    }

    @Listen('drop', { passive: false })
    HandleDrop(evt: DragEvent): void {
        evt.preventDefault();
        if (!this.disabled) {
            this.el.classList.add('dot-dropped');
            this.el.classList.remove('dot-dragover');
            this.errorType = null;
            const droppedFile: File = evt.dataTransfer.files[0];
            if (isFileAllowed(droppedFile.name, this.allowedFileTypes)) {
                this.setValue(droppedFile);
                this.binaryTextField.value = droppedFile.name;
            } else {
                this.errorType = DotBinaryMessageError.INVALID;
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
                        placeholder={this.placeholder}
                        required={this.required}
                        disabled={this.disabled}
                        accept={this.allowedFileTypes}
                        hint={this.hint}
                    />
                    <dot-binary-upload-button
                        name={this.name}
                        accept={this.allowedFileTypes}
                        disabled={this.disabled}
                        required={this.required}
                        buttonLabel={this.buttonLabel}
                    />
                </dot-label>
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private isBinaryUploadButtonEvent(element: Element): boolean {
        return element.localName === 'dot-binary-upload-button';
    }

    private validateProps(): void {
        this.optionsWatch();
    }

    private shouldShowErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.errorMessageMap.get(this.errorType);
    }

    private isValid(): boolean {
        return !(this.required && !this.value);
    }

    private setErrorMessageMap(): void {
        this.requiredMessageWatch();
        this.validationMessageWatch();
        this.URLValidationMessageWatch();
    }

    private setValue(data: File | string): void {
        this.value = data;
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.binaryTextField.value = data === null ? '' : this.binaryTextField.value;
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
