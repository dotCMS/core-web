import { Component, Element, Listen, Prop, State, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';

import { DotFieldStatus, DotTempFile } from '../../models';
import { fieldCustomProcess, getFieldsFromLayout } from './utils';
import { getClassNames, getOriginalStatus, updateStatus } from '../../utils';
import { DotCMSContentTypeLayoutRow, DotCMSContentTypeField } from 'dotcms-models';
import { DotUploadService } from './services/dot-upload.service';
import { DotHttpErrorResponse } from '../../models/dot-http-error-response.model';
import { DotBinaryFileComponent } from '../dot-binary-file/dot-binary-file';

const SUBMIT_FORM_API_URL = '/api/content/save/1';
const fallbackErrorMessages = {
    500: '500 Internal Server Error',
    400: '400 Bad Request',
    401: '401 Unauthorized Error'
};

@Component({
    tag: 'dot-form',
    styleUrl: 'dot-form.scss'
})
export class DotFormComponent {
    @Element() el: HTMLElement;

    /** (optional) List of fields (variableName) separated by comma, to be shown */
    @Prop() fieldsToShow: string;

    /** (optional) Text to be rendered on Reset button */
    @Prop({ reflectToAttr: true })
    resetLabel = 'Reset';

    /** (optional) Text to be rendered on Submit button */
    @Prop({ reflectToAttr: true })
    submitLabel = 'Submit';

    /** Layout metada to be rendered */
    @Prop({ reflectToAttr: true })
    layout: DotCMSContentTypeLayoutRow[] = [];

    /** Content type variable name */
    @Prop({ reflectToAttr: true })
    variable = '';

    @State() status: DotFieldStatus = getOriginalStatus();
    @State() errorMessage = '';
    @State() uploadFileInProgress = false;

    private fieldsStatus: { [key: string]: { [key: string]: boolean } } = {};
    private value = {};

    /**
     * Update the form value when valueChange in any of the child fields.
     *
     * @param CustomEvent event
     * @memberof DotFormComponent
     */
    @Listen('valueChange')
    onValueChange(event: CustomEvent): void {
        const { tagName } = event.target as HTMLElement;
        const { name, value } = event.detail;
        const process = fieldCustomProcess[tagName];
        if (tagName === 'DOT-BINARY-FILE') {
            this.uploadFile(event);
        } else {
            this.value[name] = process ? process(value) : value;
        }
    }

    /**
     * Update the form status when statusChange in any of the child fields
     *
     * @param CustomEvent event
     * @memberof DotFormComponent
     */
    @Listen('statusChange')
    onStatusChange({ detail }: CustomEvent): void {
        this.fieldsStatus[detail.name] = detail.status;

        this.status = updateStatus(this.status, {
            dotTouched: this.getTouched(),
            dotPristine: this.getStatusValueByName('dotPristine'),
            dotValid: this.getStatusValueByName('dotValid')
        });
    }

    @Watch('layout')
    layoutWatch() {
        this.value = this.getUpdateValue();
    }

    @Watch('fieldsToShow')
    fieldsToShowWatch() {
        this.value = this.getUpdateValue();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.status.dotValid)
        };
    }

    componentWillLoad() {
        this.value = this.getUpdateValue();
    }

    render() {
        return (
            <Fragment>
                <dot-form-error-message>{this.errorMessage}</dot-form-error-message>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    {this.layout.map((row: DotCMSContentTypeLayoutRow) => (
                        <dot-form-row row={row} fields-to-show={this.fieldsToShow} />
                    ))}
                    <div class="dot-form__buttons">
                        <button type="reset" onClick={() => this.resetForm()}>
                            {this.resetLabel}
                        </button>
                        <button
                            type="submit"
                            disabled={!this.status.dotValid || this.uploadFileInProgress}
                        >
                            {this.submitLabel}
                        </button>
                    </div>
                </form>
            </Fragment>
        );
    }

    private getStatusValueByName(name: string): boolean {
        return Object.values(this.fieldsStatus)
            .map((field: { [key: string]: boolean }) => field[name])
            .every((item: boolean) => item === true);
    }

    private getTouched(): boolean {
        return Object.values(this.fieldsStatus)
            .map((field: { [key: string]: boolean }) => field.dotTouched)
            .includes(true);
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();

        fetch(SUBMIT_FORM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stName: this.variable,
                ...this.value
            })
        })
            .then(async (response: Response) => {
                if (response.status !== 200) {
                    const error: DotHttpErrorResponse = {
                        message: await response.text(),
                        status: response.status
                    };
                    throw error;
                }
                return response.text();
            })
            .then((_text: string) => {
                // Go to success page
            })
            .catch(({ message, status }: DotHttpErrorResponse) => {
                this.errorMessage = message || fallbackErrorMessages[status];
            });
    }

    private resetForm(): void {
        const elements = Array.from(this.el.querySelectorAll('form dot-form-column > *'));

        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.warn(`${element.tagName}`, error);
            }
        });
    }

    private getUpdateValue(): { [key: string]: string } {
        return getFieldsFromLayout(
            this.layout
        ).reduce(
            (
                acc: { [key: string]: string },
                { variable, defaultValue }: DotCMSContentTypeField
            ) => {
                return {
                    ...acc,
                    [variable]: defaultValue
                };
            },
            {}
        );
    }

    private uploadFile(event: CustomEvent): void {
        const uploadService = new DotUploadService();
        const { name, value } = event.detail;
        const binary: DotBinaryFileComponent = (event.target as unknown) as DotBinaryFileComponent;
        if (value) {
            this.uploadFileInProgress = true;
            this.errorMessage = '';
            uploadService
                .uploadFile(value)
                .then((tempFile: DotTempFile) => {
                    this.value[name] = tempFile.id;
                    binary.previewImageUrl = tempFile.thumbnailUrl;
                    binary.previewImageName = tempFile.fileName;
                    this.uploadFileInProgress = false;
                })
                .catch(({ message, status }: DotHttpErrorResponse) => {
                    binary.clearValue();
                    this.uploadFileInProgress = false;
                    this.errorMessage = message || fallbackErrorMessages[status];
                });
        }
    }
}
