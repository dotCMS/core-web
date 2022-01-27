import readme from './readme.md';

export default {
    title: 'Components/Content Types Fields',
    parameters: {
        docs: {
            title: 'Time Field',
            description: {
                component:
                    'Time input with a label and a hint. You can also add a required field and a validation message.'
            },
            page: readme
        },
    },
    args: {
        value: '',
        name: '',
        label: 'Time Field',
        hint: 'Hello I am a hint',
        required: false,
        requireMessage: 'This field is required',
        validationMessage: 'This field is invalid',
        disabled: false,
        min: '',
        max: '',
        step: ''
    }
};


const Template = (args) => {
    const time = document.createElement('dot-time');

    for (const item in args) {
        time[item] = args[item];
    }

    return time;
};

export const TimeField = Template.bind({});
