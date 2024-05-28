const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';  // явно указываем версию сборки dev если переменная не будет определена, будет девелопмент

const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist'; // true под web если false под какие браузеры
const devtool = devMode ? 'source-map' : undefined;   // если режим разработки, добавляем соурсмапы

module.exports = {
	mode,
	target,
	devtool,
	devServer: {
		port: 3000,  // можно поменять порт
		open: true,
		hot: true,  // горячяя перезагрузка- перезагружает не страницу а  стили  . Если не обновляется отключить
	},

	entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
	output: {
		path:path.resolve(__dirname, 'dist'),
		clean: true,  // каждый раз очищаем папку dist
		filename: '[name].js',  // каждый раз дает новое имя файлу согласно хешу main.хеш.js
		assetModuleFilename: 'assets/[name][ext]'
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),  // путь до файла index.html
		}),

		new MiniCssExtractPlugin({
			filename: '[name].css',
		})
	],

	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',   // автообновление html
			},

			{
				test: /\.(c|sa|sc)ss$/i,  // обрабатывает файлы которые есть css|sass|sass
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,  // если devMode то используем style-loader иначе (продакшен мод) MiniCssExtractPlugin.loader
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							}
						}
					},
					'sass-loader'
				],
			},

			{
				test: /\.woff2?$/i,          //работа со шрифтами,  нужно указать все виды шрифтов которые используем
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[ext]'    // ext  это расширение   будет сохраняться в папку fonts  (если не воспользуемся генератором все будет в dist)
				}
			},

			{
				test: /\.(jpe?g|png|webp|gif|svg)$/i,
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.90],
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75
							},
						}
					}
				],         //работа со шрифтами,  нужно указать все виды шрифтов которые используем
				type: 'asset/resource',
			},

			{
				test: /\.(?:js|mjs|cjs)$/i,
				exclude: /node_modules/,     // исключаем обработку через бабель (для использования современного синтаксиса)
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { targets: "defaults" }]
						]
					}
				}
			}
		],
	},
};
