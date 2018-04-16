/**
 * 一个webpack配置的模板，当前为dev环境
 * @type {webpack}
 */
let webpack = require('webpack'),
    path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        echartJs: './echarts/index.js' // js入口配置
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 模块热更新
        new ExtractTextPlugin("styles.css") // css出口配置。有js引入的css都会被打包在这个里面
    ],
    module: {
        rules:[
            {
                test: /\.js[x]?$/, // babel解析js
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader?presets[]=es2015&presets[]=react"
                }]
            },
            {
                test: /\.(scss|sass|css)$/,  // css,autoprefix解析css，scss。。。
                loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!postcss-loader!sass-loader"})
            }
        ]
    }
};
