import { Component, Element, Listen, Prop, State, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';

import { DotFieldStatus } from '../../models';
import { fieldCustomProcess, getFieldsFromLayout } from './utils';
import { getClassNames, getOriginalStatus, updateStatus } from '../../utils';
import { DotCMSContentTypeLayoutRow, DotCMSContentTypeField, DotCMSTempFile } from 'dotcms-models';
import { DotUploadService } from './services/dot-upload.service';
import { DotHttpErrorResponse } from '../../models/dot-http-error-response.model';
import { DotBinaryFileComponent } from '../dot-binary-file/dot-binary-file';

const SUBMIT_FORM_API_URL = '/api/v1/workflow/actions/default/fire/NEW';
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
        if (tagName === 'DOT-BINARY-FILE' && value) {
            this.uploadFile(event).then((tempFile: DotCMSTempFile) => {
                this.value[name] = tempFile.id;
            });
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contentlet: {
                    contentType: this.variable,
                    ...this.value
                }
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
            this.runSuccessCallback();
        })
        .catch(({ message, status }: DotHttpErrorResponse) => {
            this.errorMessage = message || fallbackErrorMessages[status];
        });
    }

    private runSuccessCallback(): void {
        const successCallback = this.getSuccessCallback();
        if (successCallback) {
            // tslint:disable-next-line:no-eval
            eval(successCallback);
        }
    }

    private getSuccessCallback(): string {
        const successCallback = getFieldsFromLayout(this.layout).filter(
            (field: DotCMSContentTypeField) => field.variable === 'successCallback'
        )[0];
        // return successCallback.values;
        console.log('---successCallback', successCallback); // TODO: REMOVE THIS LINE
        return 'console.log("test")'; // TODO: REMOVE THIS LINE
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
        return getFieldsFromLayout(this.layout)
            .filter((field: DotCMSContentTypeField) => field.fixed === false)
            .reduce(
                (
                    acc: { [key: string]: string },
                    { variable, defaultValue, dataType, values }: DotCMSContentTypeField
                ) => {
                    return {
                        ...acc,
                        [variable]: defaultValue || (dataType !== 'TEXT' ? values : null)
                    };
                },
                {}
            );
    }

    private uploadFile(event: CustomEvent): Promise<DotCMSTempFile> {
        const uploadService = new DotUploadService();
        const value = event.detail.value;
        const binary: DotBinaryFileComponent = (event.target as unknown) as DotBinaryFileComponent;
        this.uploadFileInProgress = true;
        return uploadService
            .uploadFile(value)
            .then((tempFile: DotCMSTempFile) => {
                this.errorMessage = '';
                binary.previewImageUrl = tempFile.thumbnailUrl;
                binary.previewImageName = tempFile.fileName;
                this.uploadFileInProgress = false;
                return tempFile;
            })
            .catch(({ message, status }: DotHttpErrorResponse) => {
                binary.clearValue();
                this.uploadFileInProgress = false;
                this.errorMessage = message || fallbackErrorMessages[status];
                return null;
            });
    }
}
