import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotBinaryTextStatusEvent, DotFieldStatus, DotFieldValueEvent } from '../../../models';
import {
    getErrorClass,
    getOriginalStatus,
    isFileAllowed,
    isValidURL,
    updateStatus
} from '../../../utils';

/**
 * Represent a dotcms text field for the binary file element.
 *
 * @export
 * @class DotBinaryFile
 */
@Component({
    tag: 'dot-binary-text-field',
    styleUrl: 'dot-binary-text-field.scss'
})
export class DotBinaryTextFieldComponent {
    @Element() el: HTMLElement;

    /** Value specifies the value of the <input> element */
    @Prop({ mutable: true, reflectToAttr: true })
    value = null;

    /** (optional) Placeholder specifies a short hint that describes the expected value of the input field */
    @Prop({ reflectToAttr: true })
    placeholder = 'Attach files by dragging & dropping, selecting or pasting them.';

    /** (optional) Determine if it is mandatory */
    @Prop({ reflectToAttr: true })
    required = false;

    /** (optional) Array that describes a type of file that may be selected by the user, eg: .pdf,.jpg  */
    @Prop({ reflectToAttr: true })
    accept = '';

    /** (optional) Disables field's interaction */
    @Prop({ reflectToAttr: true })
    disabled = false;

    @State() status: DotFieldStatus;

    @Event() _valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() _statusChange: EventEmitter<DotBinaryTextStatusEvent>;

    private errorType = '';
    private file = null;
    private allowedFileTypes = [];

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.value = '';
    }

    @Watch('accept')
    optionsWatch(): void {
        this.allowedFileTypes = !!this.accept ? this.accept.split(',') : [];
    }

    componentWillLoad(): void {
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
    }

    render() {
        return (
            <Fragment>
                <input
                    type="text"
                    class={getErrorClass(this.status.dotValid)}
                    onBlur={() => this.blurHandler()}
                    disabled={this.disabled}
                    placeholder={this.placeholder}
                    value={this.value}
                    onKeyDown={(event: KeyboardEvent) => this.keyDownHandler(event)}
                    onKeyPress={(event: KeyboardEvent) => event.preventDefault()}
                    onPaste={(event: ClipboardEvent) => this.pasteHandler(event)}
                />
            </Fragment>
        );
    }

    // only supported in macOS.
    private pasteHandler(event: ClipboardEvent): void {
        this.value = '';
        const clipboardData: DataTransfer = event.clipboardData;
        if (clipboardData.items.length) {
            const clipBoardFileName = clipboardData.items[0];
            if (this.isPastingFile(clipboardData)) {
                this.handleFilePaste(clipboardData.items);
            } else {
                this.handleURLPaste(clipBoardFileName);
            }
        }
    }

    private handleFilePaste(items: DataTransferItemList) {
        const clipBoardFileName = items[0];
        const clipBoardFile = items[1].getAsFile();
        clipBoardFileName.getAsString((fileName: string) => {
            this.errorType = '';
            if (isFileAllowed(fileName, this.allowedFileTypes)) {
                this.value = fileName;
                this.setFile(clipBoardFile);
            } else {
                this.errorType = 'validationMessage';
                this.setFile(null);
            }
        });
    }

    private handleURLPaste(clipBoardFileName: DataTransferItem) {
        clipBoardFileName.getAsString((fileURL: string) => {
            this.errorType = '';
            if (isValidURL(fileURL)) {
                this.value = fileURL;
                this.setFile(fileURL);
            } else {
                this.errorType = 'URLValidationMessage';
                this.setFile(null);
            }
        });
    }

    private isPastingFile(data: DataTransfer): boolean {
        return !!data.files.length;
    }

    private keyDownHandler(evt: KeyboardEvent): void {
        if (evt.key === 'Backspace') {
            this.errorType = this.required ? 'requiredMessage' : '';
            this.value = '';
            this.setFile(null);
        }
    }

    private isValid(): boolean {
        return !(this.required && !this.file);
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setFile(data: File | string): void {
        this.file = data;
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.emitStatusChange();
        this.emitValueChange();
    }

    private emitStatusChange(): void {
        this._statusChange.emit({
            name: null,
            status: this.status,
            errorType: this.errorType
        });
    }

    private emitValueChange(): void {
        this._valueChange.emit({
            name: null,
            value: this.file
        });
    }
}
