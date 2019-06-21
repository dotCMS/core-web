import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldStatusEvent, DotFieldValueEvent } from '../../models';
import {
    getClassNames,
    getErrorClass,
    getHintId,
    getId,
    getOriginalStatus,
    getTagError,
    getTagHint,
    updateStatus
} from '../../utils';
import { watch } from 'fs';

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
export class DotBinaryFile {
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

    /** (optional) Disables field's interaction */
    @Prop({ reflectToAttr: true })
    disabled = false;

    /** (optional) Describes a type of file that may be selected by the user  */
    @Prop({ reflectToAttr: true })
    accept = '';

    @State() status: DotFieldStatus;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    allowedFileTypes = [];
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    buttonText = 'Browse';

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
        this.allowedFileTypes = this.accept.split(',');
    }

    componentDidLoad(): void {
        this.eventsHandler();
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
                        {this.buttonText}
                    </button>
                </dot-label>
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private eventsHandler(): void {
        this.dragAndDropHandler();
        this.pasteHandler();
    }

    private dragAndDropHandler(): void {
        this.el.addEventListener('dragenter', evt => {
            evt.preventDefault();
        });

        this.el.addEventListener('dragover', evt => {
            if (!this.disabled) {
                this.el.classList.add('dot-dragover');
            }
            evt.preventDefault();
        });

        this.el.addEventListener('dragleave', evt => {
            this.el.classList.remove('dot-dragover');
            evt.preventDefault();
        });

        this.el.addEventListener('drop', (evt: DragEvent) => {
            evt.preventDefault();
            if (!this.disabled) {
                this.el.classList.add('dot-dop');
                this.el.classList.remove('dot-dragover');
                const file: File = evt.dataTransfer.files[evt.dataTransfer.files.length - 1];
                if (this.isFileAllowed(file)) {
                    this.setValue(file);
                    this.setFileName(file.name);
                } else {
                    this.value = null;
                    console.log('Incorrect format');
                }
            }
        });
    }

    // only supported in iOS.
    private pasteHandler(): void {
        this.el.addEventListener('paste', (evt: ClipboardEvent) => {
            const clipboardData: DataTransfer = evt.clipboardData;
            if (this.isPastingFile(clipboardData)) {
                this.handlePasteFile(clipboardData.items, evt);
            } else {
                this.handleURLPaste(clipboardData.items[0], evt);
            }
        });
    }

    private handlePasteFile(items: DataTransferItemList, event: ClipboardEvent) {
        items[0].getAsString((fileName: string) => {
            console.log('file name:', fileName);
        });
        if (this.isFileAllowed(items[1].getAsFile())) {
            this.setValue(items[1].getAsFile());
        } else {
            console.log('invalid file');
            event.preventDefault();
        }
    }
    private handleURLPaste(item: DataTransferItem, event: ClipboardEvent) {
        item.getAsString((fileURL: string) => {
            if (this.isValidURL(fileURL)) {
                this.setValue(fileURL);
            } else {
                this.value = null;
                this.status = updateStatus(this.status, {
                    dotTouched: true,
                    dotPristine: false
                });
                event.preventDefault();
                console.log('INVALID URL');
                // TODO: Invalid file.
            }
        });
    }

    private isValidURL(url: string): boolean {
        return URL_REGEX.test(url);
    }

    private isPastingFile(data: DataTransfer): boolean {
        return !!data.files.length;
    }

    private changeHandler(event: Event): void {
        const input: HTMLInputElement = event.srcElement as HTMLInputElement;
        if (this.isFileAllowed(input.files[0])) {
            this.setValue(input.files[0]);
            this.setFileName(input.files[0].name);
        } else {
            event.preventDefault();
            this.value = null;
            this.status = updateStatus(this.status, {
                dotTouched: true,
                dotPristine: false
            });
            // TODO: Incorrect format.
            console.log('File type not supported');
        }
    }

    private keyDownHandler(evt: KeyboardEvent): void {
        const input: HTMLInputElement = evt.srcElement as HTMLInputElement;
        if (evt.key === 'Backspace' && !!this.value) {
            input.value = '';
            this.setValue(null);
        }
    }

    private buttonHandler(): void {
        const fileInput: HTMLInputElement = this.el.querySelector('dot-label input[type="file"]');
        fileInput.click();
    }

    private setFileName(name: string): void {
        const textInput: HTMLInputElement = this.el.querySelector('dot-label input[type="text"]');
        textInput.value = name;
    }

    private isFileAllowed(file: File): boolean {
        const extension = file.name.substring(file.name.indexOf('.'), file.name.length);
        if (this.accept.length === 0 || this.allowedFileTypes.indexOf('*') === 0) {
            return true;
        } else {
            return this.allowedFileTypes.indexOf(extension) >= 0;
        }
    }

    private validateProps(): void {
        // TODO: validate any prop ?
    }

    private isValid(): boolean {
        return !this.isValueRequired();
        // return !this.isValueRequired() && this.isRegexValid();
    }

    private isValueRequired(): boolean {
        return this.required && !this.value;
    }

    private shouldShowErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid() ? '' : this.requiredMessage;
        // return this.isRegexValid()
        //     ? this.isValid() ? '' : this.requiredMessage
        //     : this.validationMessage;
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setSttatus(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setValue(data: File | string): void {
        this.value = data;
        console.log('value', this.value);
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
