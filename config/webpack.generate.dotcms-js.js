var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// var glob = require("glob");

module.exports = {
    devtool: 'source-map',

    // entry: glob.sync("./src/**/*.ts"),
    entry: {
        'polyfills': './src/polyfills.browser.ts',
        'main': './src/main.browser.ts'
    },

    output: {
        path: __dirname + '/../build-dotcms-js/',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.html']
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['to-string-loader', 'css-loader', 'sass-loader'],
            },
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
                test: /\.(html)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader?name=assets/img/[name]-[hash].[ext]'
            },

            /* File loader for supporting fonts, for example, in CSS files.
             */
            {
                test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                use: 'file-loader?name=assets/fonts/[name]-[hash].[ext]'
            }
            ]
    },

    plugins: [
        new CommonsChunkPlugin({names: ['@angular', 'common'], minChunks: Infinity}),
    ]
};
