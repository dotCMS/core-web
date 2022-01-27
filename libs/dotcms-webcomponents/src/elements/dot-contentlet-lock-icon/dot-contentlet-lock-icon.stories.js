import readme from './readme.md';

export default {
    title: 'Elements',
    parameters: {
        docs: {
            title: 'Contentlet Lock Icon',
            description: {
                component:
                    'Lock icon'
            },
            page: readme
        },
    },
    args: {
        locked: true
    }
};

const Template = (args) => {
    const contentletLockIcon = document.createElement('dot-contentlet-lock-icon');

    for (const item in args) {
        contentletLockIcon[item] = args[item];
    }

    return contentletLockIcon;
};

export const Icon = Template.bind({});
