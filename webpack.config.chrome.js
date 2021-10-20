const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
    entry: {
        main: "./src/index.ts",
        cursor: "./src/core/cursor.ts",
        query: "./src/core/query.ts",
        modeler: "./src/core/modeler.ts",
        pip: "./src/core/pip.ts"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: 'core.html',
            chunks: ['main']
        })
    ]
});