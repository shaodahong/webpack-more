var path = require('path');
var fs = require("fs");
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        setting: './setting.js',
        queue: './queue.js'
    },
    output: {
        path: path.resolve(__dirname, './dist/static'),
        publicPath: './static',
        filename: '[name].[hash:5].js'
    },
    resolve: {
        extensions: ['.js', '.scss', '.vue', '*', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: '/assets/[name].[hash:5].[ext]'
                        }
                    }
                ]
            }, {
                test: /\.html$/, //获取html里面的图片
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './setting.html'),
            filename: '../setting.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunks: ['setting']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './queue.html'),
            filename: '../queue.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunks: ['queue']
        }),
        new ExtractTextPlugin({
            filename: 'setting.[hash:5].css',
            allChunks: true,
            disable: false
        }),
        new CleanWebpackPlugin(['dist']),
        new Webpack.HotModuleReplacementPlugin(), //热加载
    ],
    devServer: {
        contentBase: './',
        host: 'localhost',
        inline: false,
        hot: true,
    }
}
