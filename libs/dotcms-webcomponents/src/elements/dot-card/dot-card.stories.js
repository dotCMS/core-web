import readme from './readme.md';

export default {
    title: 'Elements',
    parameters: {
        docs: {
            title: 'Card',
            description: {
                component:
                    'A card component.'
            },
            page: readme
        },
    },
};
export const Card = () =>
    `<dot-card><h3>Hello World</h3></dot-card>`;
