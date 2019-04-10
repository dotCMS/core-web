import {
    DotCMSFormConfig,
    DotCMSContentTypeField,
    DotCMSContentType,
    DotCMSError
} from '../models';
import { DotApiContentType } from './DotApiContentType';
import { DotApiContent } from './DotApiContent';

enum FieldElementsTags {
    Text = 'dot-textfield',
    Checkbox = 'dot-checkbox',
    Select = 'dot-dropdown'
}

/**
 * Creates and provide methods to render a DotCMS Form
 *
 */
export class DotApiForm {
    private contentType: DotCMSContentType;
    private fields: DotCMSContentTypeField[];

    constructor(
        private dotApiContentType: DotApiContentType,
        private formConfig: DotCMSFormConfig,
        private content: DotApiContent
    ) {}

    /**
     * Render form on provided html element
     * @param {HTMLElement} container
     * @memberof DotApiForm
     */
    async render(container: HTMLElement) {
        this.contentType =
            this.contentType || (await this.dotApiContentType.get(this.formConfig.identifier));
        this.fields = this.contentType.fields;

        const importScript = document.createElement('script');
        importScript.type = 'module';
        importScript.text = `
            import { defineCustomElements } from 'http://localhost:8080/fieldElements/loader/index.js';
            //import { defineCustomElements } from 'https://unpkg.com/dotcms-field-elements@latest/dist/loader';
            defineCustomElements(window);`;

        const fieldScript = this.createFieldTags(this.fields);
        const formTag = this.createForm(fieldScript);
        container.append(importScript, formTag);
    }

    private shouldSetFormLabel(label: string, labelConfig: {submit?: string, reset?: string}): boolean {
        return !!(labelConfig && labelConfig[label]);
    }

    private createForm(fieldScript: string): HTMLElement {
        const dotFormEl = document.createElement('dot-form');

        ['submit', 'reset'].forEach((label: string) => {
            if (this.shouldSetFormLabel(label, this.formConfig.labels)) {
                dotFormEl.setAttribute(`${label}-label`, this.formConfig.labels[label]);
            }
        });

        dotFormEl.innerHTML = fieldScript;

        dotFormEl.addEventListener('formSubmit', (e: CustomEvent) => {
            e.preventDefault();
            this.content
                .save({
                    contentHost: this.formConfig.contentHost,
                    stName: this.contentType.variable,
                    ...e.detail.target._formValues
                })
                .then((data: Response) => {
                    if (this.formConfig.onSuccess) {
                        this.formConfig.onSuccess(data);
                    }
                })
                .catch((error: DotCMSError) => {
                    if (this.formConfig.onError) {
                        this.formConfig.onError(error);
                    }
                });
        });

        return dotFormEl;
    }

    private shouldCreateSpecificTags(fields: string[]): boolean {
        return fields && fields.length > 0;
    }

    private createFieldTags(fields: DotCMSContentTypeField[]): string {
        const fieldTags = fields
            .map((field: DotCMSContentTypeField) => {
                if (this.shouldCreateSpecificTags(this.formConfig.fields)) {
                    return this.formConfig.fields.includes(field.variable) ? this.createField(field) : '';
                }
                return this.createField(field);
            })
            .join('');
        return fieldTags;
    }

    private getFieldTag(field: DotCMSContentTypeField): string {
        return FieldElementsTags[field.fieldType];
    }

    private formatValuesAttribute(values: string, fieldTag: string): string {
        const breakLineTags = ['dot-checkbox', 'dot-dropdown', 'dot-radio-button'];
        let formattedValue = values;

        // Todo: complete with other DOT-FIELDS as they get created
        if (breakLineTags.includes(fieldTag)) {
            formattedValue = values.split('\r\n').join(',');
        }
        return formattedValue;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private createField(field: DotCMSContentTypeField): string {
        const fieldTag = this.getFieldTag(field);
        return fieldTag
            ? `
            <${fieldTag}
                ${field.variable ? `name='${field.variable}'` : ''}
                ${field.name ? `label='${field.name}'` : ''}
                ${field.defaultValue ? `value='${field.defaultValue}'` : ''}
                ${
                    field.values
                        ? `options='${this.formatValuesAttribute(field.values, fieldTag)}'`
                        : ''
                }
                ${field.hint ? `hint='${field.hint}'` : ''}
                ${field.required ? 'required' : ''}
            ></${fieldTag}>`
            : '';
    }
}
