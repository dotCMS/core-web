const rootMain = require('../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(...['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']);

module.exports = {
    ...rootMain,
    refs: {
        webcomponents: {
            title: 'DotCMS WebComponents',
            url: 'https://dotcms.github.io/core-web/dotcms-webcomponents'
        },
        blockeditor: {
            title: 'DotCMS Block Editor',
            url: 'https://dotcms.github.io/core-web/block-editor'
        }
    }
};
