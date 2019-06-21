import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldStatusEvent, DotFieldValueEvent } from '../../models';
import {
    checkProp,
    getClassNames, getDotOptionsFromFieldValue,
    getErrorClass,
    getHintId,
    getId,
    getOriginalStatus,
    getTagError,
    getTagHint,
    updateStatus
} from '../../utils';

const URL_REGEX = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
);

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

    allowedFileTypes = [];

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.value = '';
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
        this.dragAndDropHandler();
        this.pasteHandler();
    }

    @Watch('accept')
    optionsWatch(): void {
        const validTypes  = checkProp<DotBinaryFileComponent, string>(this, 'accept');
        this.allowedFileTypes = validTypes.split(',');
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
                    <input
                        type="text"
                        onBlur={() => this.blurHandler()}
                        disabled={this.disabled}
                        placeholder={this.placeholder}
                        onKeyDown={(event: KeyboardEvent) => this.keyDownHandler(event)}
                        onKeyPress={(event: KeyboardEvent) => event.preventDefault()}
                    />
                    <input
                        aria-describedby={getHintId(this.hint)}
                        class={getErrorClass(this.status.dotValid)}
                        disabled={this.disabled}
                        id={getId(this.name)}
                        onChange={(event: Event) => this.changeHandler(event)}
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
                {this.errorElement}
            </Fragment>
        );
    }

    private dragAndDropHandler(): void {
        this.el.addEventListener('dragover', (evt: DragEvent) => {
            if (!this.disabled) {
                this.el.classList.add('dot-dragover');
            }
            evt.preventDefault();
        });

        this.el.addEventListener('dragleave', (evt: DragEvent) => {
            this.el.classList.remove('dot-dragover');
            evt.preventDefault();
        });

        this.el.addEventListener('drop', (evt: DragEvent) => {
            evt.preventDefault();
            if (!this.disabled) {
                this.el.classList.add('dot-dop');
                this.el.classList.remove('dot-dragover');
                const droppedFile: File = evt.dataTransfer.files[evt.dataTransfer.files.length - 1];
                if (this.isFileAllowed(droppedFile.name)) {
                    this.setValue(droppedFile);
                    this.setFileDisplayName(droppedFile.name);
                } else {
                    this.clearField(this.validationMessage);
                }
            }
        });
    }

    // only supported in iOS.
    private pasteHandler(): void {
        this.el.addEventListener('paste', (evt: ClipboardEvent) => {
            const clipboardData: DataTransfer = evt.clipboardData;
            if (clipboardData.items.length) {
                if (this.isPastingFile(clipboardData)) {
                    this.handleFilePaste(clipboardData.items);
                } else {
                    this.handleURLPaste(clipboardData.items[0]);
                }
            }
        });
    }

    private changeHandler(event: Event): void {
        const input: HTMLInputElement = event.srcElement as HTMLInputElement;
        if (this.isFileAllowed(input.files[0].name)) {
            this.setValue(input.files[0]);
            this.setFileDisplayName(input.files[0].name);
        } else {
            event.preventDefault();
            this.clearField(this.validationMessage);
        }
    }

    private handleFilePaste(items: DataTransferItemList) {
        const clipBoardFile = items[1].getAsFile();
        items[0].getAsString((fileName: string) => {
            if (this.isFileAllowed(fileName)) {
                this.setValue(clipBoardFile);
            } else {
                this.clearField(this.validationMessage);
            }
        });
    }

    private handleURLPaste(item: DataTransferItem) {
        item.getAsString((fileURL: string) => {
            if (this.isValidURL(fileURL)) {
                this.setValue(fileURL);
            } else {
                this.clearField(this.URLValidationMessage);
            }
        });
    }

    private clearField(validationMessage: string) {
        this.setValue(null, validationMessage);
        this.setFileDisplayName('');
    }

    private isValidURL(url: string): boolean {
        return URL_REGEX.test(url);
    }

    private isPastingFile(data: DataTransfer): boolean {
        return !!data.files.length;
    }

    private keyDownHandler(evt: KeyboardEvent): void {
        if (evt.key === 'Backspace') {
            this.required ? this.setValue(null, this.requiredMessage) : this.setValue(null);
        }
    }

    private buttonHandler(): void {
        const fileInput: HTMLInputElement = this.el.querySelector('dot-label input[type="file"]');
        fileInput.click();
    }

    private setFileDisplayName(name: string): void {
        const textInput: HTMLInputElement = this.el.querySelector('dot-label input[type="text"]');
        textInput.value = name;
    }

    private isFileAllowed(name: string): boolean {
        const extension = name.substring(name.indexOf('.'), name.length);
        if (this.allowedFileTypes.length === 0 || this.allowedFileTypes.indexOf('*') === 0) {
            return true;
        } else {
            return this.allowedFileTypes.indexOf(extension) >= 0;
        }
    }

    private validateProps(): void {
        this.optionsWatch();
    }

    private isValid(): boolean {
        return !(this.required && !this.value);
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setValue(data: File | string, errorMessage?: string): void {
        this.value = data;
        this.errorElement = getTagError(!!errorMessage, errorMessage);
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
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
