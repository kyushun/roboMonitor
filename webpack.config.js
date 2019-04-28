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
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: []
}