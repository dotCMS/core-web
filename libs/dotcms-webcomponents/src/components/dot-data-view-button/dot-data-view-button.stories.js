import readme from './readme.md';

export default {
    title: 'Components',
    parameters: {
        docs: {
            title: 'Data view button',
            description: {
                component:
                    'A group button to select data view options.',
            },
            page: readme
        },
    },
};

export const DataViewButton = () => `<dot-data-view-button value="list" />`;
