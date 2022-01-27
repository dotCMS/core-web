import readme from './readme.md';

export default {
    title: 'Elements',
    parameters: {
        docs: {
            title: 'Badge',
            description: {
                component:
                    'Display a badge with a number.'
            },
            page: readme
        },
    },
    args: {
        innerText: '99',
        color: '#000000',
        size: '16px',
        bgColor: 'lightblue'
    }
};

const Template = (args) => {
    const contentletLockIcon = document.createElement('dot-badge');

    for (const item in args) {
        contentletLockIcon[item] = args[item];
    }

    return contentletLockIcon;
};

export const Badge = Template.bind({});
