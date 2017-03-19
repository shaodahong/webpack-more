var path = require('path');
var fs = require("fs");
var glob = require('glob');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isPro = process.env.NODE_ENV === 'production' ? true : false;

var webpackConfig = {
    entry: {},
    output: {
        path: path.resolve(__dirname, './dist/static'),
        publicPath: './static',
        filename: isPro ? '[name].[hash:5].js' : '[name].js',
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
            loader: 'vue-loader'
        }, {
            test: /\.js/,
            loader: 'babel-loader',
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }, {
            test: /\.scss/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    'sass-loader'
                ]
            }),
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }, {
            test: /\.css/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader'
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
                    name: '/images/[name].[hash:5].[ext]'
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
            test: /\.html$/,
            loader: 'html-loader',
            exclude: './node_modules/',
            include: path.resolve(__dirname, './src')
        }]
    },
    plugins: [
        new Webpack.ProvidePlugin({
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
        }),
        new ExtractTextPlugin({
            filename: isPro ? 'css/[name].[hash:5].css' : 'css/[name].css',
            allChunks: true,
            disable: false
        }),
        new Webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist/',
        host: 'localhost',
        inline: false,
        hot: true,
    }
}

function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filepath) {
        var split = filepath.split('/');
        var name = split[split.length - 2];

        entries[name] = filepath;
    });

    return entries;
}

var entries = getEntries('./src/pages/**/*.js');

Object.keys(entries).forEach(function(name) {
    webpackConfig.entry[name] = entries[name];
    var plugin = new HtmlWebpackPlugin({
        filename: '../' + name + '.html',
        template: './src/pages/' + name + '/' + name + '.html',
        inject: true,
        chunks: [name, 'vendors']
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;
