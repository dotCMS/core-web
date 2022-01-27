import readme from './readme.md';

export default {
    title: 'Components / State Icon',
    docs: {
        title: 'State Icon',
        description: {
            component:
                'Display the state of a component'
        },
        page: readme
    }
};

export const Draft = () => {
    const props = [
        {
            name: 'state',
            content: {
                live: 'false',
                working: 'true',
                deleted: 'false',
            }
        }
    ];

    const stateIcon = document.createElement('dot-state-icon');

    props.forEach(({ name, content }) => {
        stateIcon[name] = content;
    });

    return stateIcon;
};

export const Archived = () => {
    const props = [
        {
            name: 'state',
            content: {
                deleted: 'true'
            }
        }
    ];

    const stateIcon = document.createElement('dot-state-icon');

    props.forEach(({ name, content }) => {
        stateIcon[name] = content;
    });

    return stateIcon;
};

export const Drafted = () => {
    const props = [
        {
            name: 'state',
            content: {
                hasLiveVersion: true,
                live: false,
                working: true,
                deleted: false
            }
        }
    ];

    const stateIcon = document.createElement('dot-state-icon');

    props.forEach(({ name, content }) => {
        stateIcon[name] = content;
    });

    return stateIcon;
};

export const Published = () => {
    const props = [
        {
            name: 'state',
            content: {
                live: 'true',
                hasLiveVersion: 'true',
                working: 'true',
                deleted: 'false'
            }
        }
    ];

    const stateIcon = document.createElement('dot-state-icon');

    props.forEach(({ name, content }) => {
        stateIcon[name] = content;
    });

    return stateIcon;
};

