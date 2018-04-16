/**
 * 一个webpack配置的模板，当前为dev环境
 * @type {webpack}
 */
let webpack = require('webpack'),
    path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        echartJs: './echarts/index.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 模块热更新
        new ExtractTextPlugin("styles.css")
    ],
    module: {
        rules:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader?presets[]=es2015&presets[]=react"
                }]
            },
            {
                test: /\.(scss|sass|css)$/,  // pack sass and css files
                loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!postcss-loader!sass-loader"})
            },
            { test : /\.css$/, loader: 'css-loader' },
            {
                test: /\.html/,
                loader: 'html',
            }
        ]
    }
};
