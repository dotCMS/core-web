const rootMain = require('../../../.storybook/main');

module.exports = {
    ...rootMain,

    refs: (config, { configType }) => {
        if (configType === 'PRODUCTION') {
            return {
                "web-components": {
                    title: 'Web Components',
                    url: 'https://dotcms.github.io/core-web/sb/dotcms-webcomponents',
                },
                "block-editor": {
                    title: 'Block Editor',
                    url: 'https://dotcms.github.io/core-web/sb/dotcms-block-editor',
                }
            };
        }
        return {};
    },

    core: { ...rootMain.core, builder: 'webpack5' },

    stories: [
        ...rootMain.stories,
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [...rootMain.addons],
    webpackFinal: async (config, { configType }) => {
        // apply any global webpack configs that might have been specified in .storybook/main.js
        if (rootMain.webpackFinal) {
            config = await rootMain.webpackFinal(config, { configType });
        }

        // add your own webpack tweaks if needed

        return config;
    },
};
