module.exports = {
    stories: [],
    addons: ['@storybook/addon-knobs/register', '@storybook/addon-links', '@storybook/addon-essentials'],
    refs: (config) => {
        //👇 Retrieves the current environment from the config object
        const { configType } = config;

        if (configType === 'DEVELOPMENT') {
            return {
                dotcmsWebComponents: {
                    title: 'DotCMS Web Components',
                    url: 'http://localhost:6600'
                }
            };
        }

        return {
            dotcmsWebComponents: {
                title: 'DotCMS Web Components',
                url: 'https://dotcms.github.io/core-web/dotcms-webcomponents'
            }
        };
    }
};
