import readme from "./readme.md";

export default {
    title: 'Components',
    parameters: {
        docs: {
            title: 'Select Button',
            description: {
                component:
                    'A select button you can pass different options to the component.'
            },
            page: readme
        },
    },
    args: {
        value: 'code',
        options: [
            {
                label: 'Code',
                icon: 'code',
            },

            {
                label: 'Backup',
                icon: 'backup',
                disabled: true
            },
            {
                label: 'Help',
                icon: 'help',
            },

        ]
    }
};


const Template = (args) => {

    const dotSelectButton = document.createElement('dot-select-button');

    for (const item in args) {
        dotSelectButton[item] = args[item];
    }

    return dotSelectButton;
}

export const SelectButton = Template.bind({});
