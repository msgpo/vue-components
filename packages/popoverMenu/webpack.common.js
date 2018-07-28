const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['vue-style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader',
					{
						// always load variables file
						loader: 'sass-resources-loader',
						options: {
							resources: path.resolve(
								__dirname,
								'../../variables.scss'
							)
						}
					}
				]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	plugins: [new VueLoaderPlugin()]
};
