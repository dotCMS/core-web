import { DotApiForm } from '../DotApiForm';
import { DotCMSContentType } from '../../models';

const fieldReturned = [
    {
        fieldType: 'Text',
        defaultValue: 'defaultValue1',
        hint: 'hint1',
        name: 'field1',
        required: true,
        value: 'value1',
        variable: 'field1'
    },
    {
        fieldType: 'Text',
        defaultValue: 'defaultValue',
        hint: 'hint2',
        name: 'field2',
        required: true,
        value: 'value2',
        variable: 'field2'
    }
];

const contentTypeReturned: DotCMSContentType = {
    clazz: 'A',
    defaultType: true,
    fields: fieldReturned,
    fixed: true,
    folder: 'FolderA',
    host: 'HostA',
    name: 'TestA',
    owner: 'me',
    system: true,
    variable: 'contentTest1'
};

class DotApiContentTypeMock {
    get(): Promise<DotCMSContentType> {
        return new Promise((resolve) => {
            resolve(contentTypeReturned);
        });
    }
}

class DotApiContentMock {
    save(): Promise<any> {
        return new Promise((resolve) => {
            resolve({
                status: 200,
                text: () => '<h1>Hello Widget</h1>'
            });
        });
    }
}

describe('DotApiForm', () => {
    let dotApiContent;
    let dotApiContentType;
    let dotApiForm;

    beforeEach(() => {
        dotApiContent = new DotApiContentMock();
        dotApiContentType = new DotApiContentTypeMock();
    });

    it('should render a Form and execute "onSucess" function on submit', async () => {
        const expectedForm = `<script type="module">
            import { defineCustomElements } from 'http://localhost:8080/fieldElements/loader/index.js';
            //import { defineCustomElements } from 'https://unpkg.com/dotcms-field-elements@0.0.2/dist/loader';
            defineCustomElements(window);</script><dot-form submit-label="Save" reset-label="Clear">
            <dot-textfield name="field1" label="field1" value="defaultValue1" hint="hint1" required=""></dot-textfield>
            <dot-textfield name="field2" label="field2" value="defaultValue" hint="hint2" required=""></dot-textfield></dot-form>`;

        const config = {
            identifier: '321',
            labels: {
                submit: 'Save',
                reset: 'Clear'
            },
            onSuccess: function(data: any) {
                console.log('*** onSuccess data', data);
            },
            onError: function(error: any) {
                console.log('*** onError data', error);
            }
        };
        const container = document.createElement('div');
        spyOn(container, 'append').and.callThrough();
        spyOn(config, 'onSuccess').and.callThrough();
        dotApiForm = new DotApiForm(dotApiContentType, config, dotApiContent);

        dotApiForm.render(container).then(() => {
            expect(container.append).toHaveBeenCalled();
            expect(container.innerHTML).toBe(expectedForm);

            const formTag = container.getElementsByTagName('dot-textfield')[0];
            const customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent('formSubmit', true, false, {});
            formTag.dispatchEvent(customEvent);
            expect('config.onSuccess').toHaveBeenCalled();
        });
    });

    it('should render a Form with 1 field', async () => {
        const expectedForm = `<script type="module">
            import { defineCustomElements } from 'http://localhost:8080/fieldElements/loader/index.js';
            //import { defineCustomElements } from 'https://unpkg.com/dotcms-field-elements@0.0.2/dist/loader';
            defineCustomElements(window);</script><dot-form submit-label="Submit" reset-label="Reset">
            <dot-textfield name="field1" label="field1" value="defaultValue1" hint="hint1" required=""></dot-textfield></dot-form>`;

        const config = { identifier: '321', fields: ['field1'] };
        const container = document.createElement('div');
        spyOn(container, 'append').and.callThrough();
        dotApiForm = new DotApiForm(dotApiContentType, config, dotApiContent);

        dotApiForm.render(container).then(() => {
            expect(container.append).toHaveBeenCalled();
            expect(container.innerHTML).toBe(expectedForm);
        });
    });
});
