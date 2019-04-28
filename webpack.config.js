const path = require('path');

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'public/js')

module.exports = {
    mode: 'development',
    entry: src + '/index.jsx',

    output: {
        path: dist,
        filename: 'app.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', {
                            legacy: true
                        }],
                        ['@babel/plugin-proposal-class-properties', {
                            loose: true
                        }]
                    ]
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: []
}