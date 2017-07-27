var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    devtool: 'source-map',

    entry: {
        'polyfills': './src/polyfills.browser.ts',
        'main': './src/main.browser.ts'
    },

    output: {
        path: __dirname + '/build-dotcms-js/',
        publicPath: 'build-dotcms-js/',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.html']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options:
                    {
                        configFileName: 'tsconfig.dotcms-js.json',
                    }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(css|html)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=10000'
            }
            ]
    },

    plugins: [
        new CommonsChunkPlugin({names: ['@angular', 'common'], minChunks: Infinity}),
    ]
};
