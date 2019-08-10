const path = require('path');

const HtmlWP = require('html-webpack-plugin');
const MiniCssEP = require('mini-css-extract-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'), //opt
    },
    plugins: [
        new HtmlWP({
            filename: 'index.html',
            template: 'public/index.html'
        }),
        new MiniCssEP({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'babel-loader'}
                ]
            },
            {
                test: /\.module.scss$/,
                use: [
                    {loader: MiniCssEP.loader},
                    {loader: 'css-loader',
                    options: {
                        modules: {
                            //localIdentName: '[path][name]__[local]__[hash:base64:5]',
                            localIdentName: '[name]__[local]__[hash:base64:5]',
                        },
                    }},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test: /\.scss$/,
                exclude: /\.module.scss$/,
                use: [
                    {loader: MiniCssEP.loader},
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            {
                type: 'javascript/auto',
                test: /\.(svg|json)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};