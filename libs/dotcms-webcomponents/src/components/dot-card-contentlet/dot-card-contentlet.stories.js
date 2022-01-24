import { withActions } from '@storybook/addon-actions';

import readme from './readme.md';

export default {
    title: 'Components',
    decorators: [withActions('valueChange')],
    parameters: {
        notes: readme
    },
    argTypes: {
        item: {
            type: 'object',
            defaultValue: {

                data: {
                    baseType: 'HTMLPAGE',
                    title: 'Hola Mundo',
                    language: 'es-es',
                    locked: 'true',
                    live: 'true',
                    working: 'false',
                    deleted: 'false',
                    hasLiveVersion: 'true',
                    hasTitleImage: 'false',
                    contentTypeIcon: 'description'
                },
                actions: [
                    {
                        label: 'Action 1',
                        action: (e) => {
                            console.log(e);
                        }
                    },
                    {
                        label: 'Action 2',
                        action: (e) => {
                            console.log(e);
                        }
                    }
                ]
            }
        }
    }
};

const Template = ({ item }) => {
    const props = [
        {
            name: 'item',
            content: item
        }
    ];

    const cardContentlet = document.createElement('dot-card-contentlet');
    props.forEach(({ name, content }) => {
        cardContentlet[name] = content;
    });

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.width = '250px';
    div.style.height = '300px';

    div.appendChild(cardContentlet);

    return div;
};

export const ContentletCard = Template.bind({})
