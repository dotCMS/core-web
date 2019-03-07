const path = require('path');

// // Export a function. Accept the base config as the only param.
// module.exports = ({ config, mode }) => {
//   // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
//   // You can change the configuration based on that.
//   // 'PRODUCTION' is used when building the static version of storybook.

//   // Make whatever fine-grained changes you need
//   config.module.rules.push({
//     test: /\.scss$/,
//     loaders: ['style-loader', 'css-loader', 'sass-loader'],
//     include: path.resolve(__dirname, '../'),
//   });

//   // Return the altered config
//   return config;
// };


module.exports = {
	resolve: {
		alias: {
			styles: path.resolve(__dirname, '../src/styles')
		}
	}
};