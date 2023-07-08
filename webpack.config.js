const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        // rename key to visualization name
        sports_hero_visualization: path.resolve(__dirname, './src/hero_viz.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: './dist',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Looker Custom Visualizations'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/ ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
                test: /\.(gif|png|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.svg$/,
                use: [
                {
                    loader: 'svg-url-loader',
                    options: {
                    jsx: true, // Enable JSX in SVG files
                    }
                },
                'react-svg-loader',
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.svg'], // Include .svg as a resolvable extension
      }
}