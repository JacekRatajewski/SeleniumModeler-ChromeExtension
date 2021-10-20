const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
    entry: {
        main: "./src/popup/index.ts",
        popup: "./src/popup/popup.ts"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/electron'),
        clean: true
    },
    plugins: 
    [
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new HtmlWebpackPlugin({
            template: "./src/popup/index.html",
            filename: 'index.html',
            chunks: ['popup'],
            publicPath: '/static'
        })
    ]
});