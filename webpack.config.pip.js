const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
    entry: {
        pip: "./src/pip/pip.ts"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/pip'),
        clean: true
    },
    plugins:
        [
            new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
            new HtmlWebpackPlugin({
                template: "./src/pip/pip.html",
                filename: 'pip.html',
                chunks: ['pip'],
                publicPath: '/static'
            })
        ]
});