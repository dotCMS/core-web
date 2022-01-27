import readme from './readme.md';

export default {
    title: 'Components',
    parameters: {
        docs: {
            title: 'Context Menu',
            description: {
                component:
                    'Context menu component that can be used to show a list of actions to the user.',
            },
            page: readme
        },
    },
    args: {
        options: [
            {
                label: 'Publish',
                action: (e) => {
                    console.log(e);
                }
            },
            {
                label: 'Archived',
                action: (e) => {
                    console.log(e);
                }
            }
        ]
    }
};

const Template = (args) => {
    const menu = document.createElement('dot-context-menu');

    for (const item in args) {
        menu[item] = args[item];
    }

    return menu;
}


export const ContextMenu = Template.bind({});
