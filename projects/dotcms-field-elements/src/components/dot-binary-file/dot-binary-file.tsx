import { Component, Element, Event, EventEmitter, Method, Prop, State } from '@stencil/core';
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
import { element } from 'protractor';

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
    placeholder = '';

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

    /** (optional) Describes a type of file that may be selected by the user  */
    @Prop({ reflectToAttr: true })
    multiple = false;

    @State() status: DotFieldStatus;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    allowedFileTypes = [];
    fileList: File[] = [];
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

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
        const uploadButton: HTMLElement = this.el.querySelector('button');
        const realInput: HTMLInputElement = this.el.querySelector('dot-label input[type="file"]');
        const dotLabel: HTMLElement = this.el.querySelector('.dot-label');
        const inputText: HTMLInputElement = this.el.querySelector('dot-label input[type="text"]');

        uploadButton.addEventListener('click', () => {
            realInput.click();
        });

        realInput.addEventListener('change', () => {
            this.fileList = [];
            for (let i = 0; i < realInput.files.length; i++) {
                debugger;
                const file: File = realInput.files[i];
                if (this.isFileAllowed(file)) {
                    this.addFile(file);
                } else {
                    console.log('One of more have incorrect format');
                }
            }
            this.setInputFileNames(inputText);
        });

        dotLabel.addEventListener('dragover', evt => {
            dotLabel.style.backgroundColor = 'green';
            evt.preventDefault();
        });

        dotLabel.addEventListener('dragenter', evt => {
            dotLabel.style.backgroundColor = 'red';
            evt.preventDefault();
        });

        dotLabel.addEventListener('drop', (evt: DragEvent) => {
            evt.preventDefault();
            this.fileList = [];
            dotLabel.style.backgroundColor = 'blue';
            for (let i = 0; i < evt.dataTransfer.files.length; i++) {
                debugger;
                const file: File = evt.dataTransfer.files[i];
                if (this.isFileAllowed(file)) {
                    this.addFile(file);
                } else {
                    console.log('One of more have incorrect format');
                }
            }
            this.setInputFileNames(inputText);
        });

        dotLabel.addEventListener('paste', evt => {
            let items;
            debugger;
            this.fileList = [];
            const clipboardData = evt.clipboardData;
            if (typeof clipboardData === 'object') {
                items = clipboardData.items || clipboardData.files || [];

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];

                    // maybe is trying to paste a URL.
                    if (item.type === 'text/html') {
                        fetch(
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoGUmPpB4wrbXA_NeoboVrdzkFA8uXAuLWaNkpJOt8d64YDTWuyQ'
                        )
                            .then(res => res.blob()) // Gets the response and returns it as a blob
                            .then(blob => {
                                this.addFile(new File([blob], 'testName'));
                            });
                    } else if (this.isDataTransferAllowed(item)) {
                        item.getAsString(this.test);
                        this.addFile(item.getAsFile());
                    }
                }
            }
            evt.preventDefault();
        });

        // realInput.addEventListener('change', () => {
        //     const name = realInput.value.split(/\\|\//).pop();
        //     const truncated = name.length > 20 ? name.substr(name.length - 20) : name;
        //
        //     fileInfo.innerHTML = truncated;
        // });
    }

    addFile(file: File): void {
        this.fileList.push(file);
        // this.formData.append(file.name, file);
        console.log('File added: ', file.name);
        console.log('file: ', file);
        console.log('File List Size: ', this.fileList.length);
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
                    <input type="text" />
                    <input
                        aria-describedby={getHintId(this.hint)}
                        class={getErrorClass(this.status.dotValid)}
                        disabled={this.disabled || null}
                        id={getId(this.name)}
                        onblur={() => this.blurHandler()}
                        oninput={(event: Event) => this.setValue(event)}
                        placeholder={this.placeholder}
                        required={this.required || null}
                        type="file"
                        accept={this.accept}
                        multiple={this.multiple}
                        value={this.value}
                    />
                    <button>Browse</button>
                </dot-label>
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private test(param: any): string {
        console.log('param: ', param);
        return param;
    }

    private isDataTransferAllowed(data: DataTransferItem): boolean {
        console.log('file.kind', data.kind);
        if (data.kind === 'string') {
            return false;
        }
        if (this.allowedTypes.indexOf('*') === 0) {
            return true;
        } else {
            return this.allowedTypes.indexOf(data.type) >= 0;
        }
    }

    private isFileAllowed(file: File): boolean {
        const extension = file.name.substring(file.name.indexOf('.'), file.name.length);
        console.log('file.type', file.type);
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
        return this.required && !this.value;
        // return !this.isValueRequired() && this.isRegexValid();
    }

    private setInputFileNames(inputText: HTMLInputElement): void {
        if (this.fileList.length > 1) {
            inputText.setAttribute('value', `${this.fileList.length} files Selected`);
        } else if (this.fileList.length === 1) {
            inputText.setAttribute('value', this.fileList[0].name);
        }
        inputText.focus();
    }

    // private isValueRequired(): boolean {
    //     return this.required && !this.value;
    // }

    // private isRegexValid(): boolean {
    //     if (this.regexCheck && this.value) {
    //         const regex = new RegExp(this.regexCheck);
    //         return regex.test(this.value);
    //     }
    //     return true;
    // }

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

    private setValue(event): void {
        const files: FileList = event.target.files;
        //console.log(input.files);
        this.value = files;
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
