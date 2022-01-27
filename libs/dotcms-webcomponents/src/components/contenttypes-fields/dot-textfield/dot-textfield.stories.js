import readme from './readme.md';

export default {
    title: 'Components/Content Types Fields',
    parameters: {
        docs: {
            title: 'Textfield',
            description: {
                component:
                    'Textfield with a label and a hint. You can also add a required field and a validation message.'
            },
            page: readme
        },
    },
    args: {
        value: '',
        name: '',
        label: 'Textfield',
        hint: 'Hello I am a hint',
        required: false,
        requireMessage: 'This field is required',
        validationMessage: 'This field is invalid',
        disabled: false,
        regexCheck: '',
        type: 'text',
        hint: 'This is a help message',
    }
};

const Template = (args) => {
    const textfield = document.createElement('dot-textfield');

    for (const item in args) {
        textfield[item] = args[item];
    }

    return textfield;
};

export const TextField = Template.bind({});
