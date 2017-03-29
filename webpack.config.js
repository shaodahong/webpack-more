var path = require('path');
var fs = require("fs");
var glob = require('glob');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isPro = process.env.NODE_ENV === 'production' ? true : false;

// var publicPath = 'http://localhost:8000/';

var webpackConfig = {
    entry: {},
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: isPro ? 'static/[name].[hash:5].js' : 'static/[name].js',
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader'
                        ]
                    }),
                    scss: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'sass-loader',
                            'postcss-loader'
                        ]
                    }),
                }
            }
        }, {
            test: /\.js/,
            loader: 'babel-loader',
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }, {
            test: /\.css/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    'postcss-loader'
                ]
            }),
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }, {
            test: /\.(sass|scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            }),
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src'),
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'static/images/[name].[hash:5].[ext]'
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    optipng: {
                        optimizationLevel: 7,
                    },
                    pngquant: {
                        quality: '60-80',
                        speed: 4
                    },
                },
            }],
        }, {
            test: /\.(woff2?|eot|ttf|otf)\??.*$/,
            loader: "url-loader",
            // options: {
            //     limit: 10000,
            //     name: isPro ? 'static/fonts/[name].[hash:5].[ext]' : 'static/fonts/[name].[ext]'
            // }
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }]
    },
    plugins: [
        new Webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [require('autoprefixer')({browsers: ['> 1%', 'last 2 versions']})];
                }
            }
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        new Webpack.ProvidePlugin({}),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
        }),
        new ExtractTextPlugin({
            filename: isPro ? 'static/css/[name].[hash:5].css' : 'static/css/[name].css',
            allChunks: true,
            disable: isPro ? false : true
        }),
    ],
    devServer: {
        historyApiFallback: {
            disableDotRule: true
        }
    },
}

function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filepath) {
        var split = filepath.split('/');
        var name = split[split.length - 2];

        entries[name] = filepath;
    });

    return entries;
}

var entries = getEntries('./src/pages/**/*.js');
var hot = 'webpack-hot-middleware/client?reload=true';

Object.keys(entries).forEach(function (name) {
    webpackConfig.entry[name] = [hot, entries[name]];
    var plugin = new HtmlWebpackPlugin({
        filename: name + '.html',
        template: './src/pages/' + name + '/' + name + '.html',
        inject: true,
        chunks: [name, 'vendors']
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;
