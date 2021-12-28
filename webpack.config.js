const path = require('path');

const browsers = [">= 5%", "edge >= 18", "not ie <= 11"];

const rules = [
    {
        test: /\.css$/,
        use: [
            'style-loader',
            '@teamsupercell/typings-for-css-modules-loader',
            {
                loader: 'css-loader',
                options: { modules: true }
            }
        ]
    },
    {
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: 'url-loader',
        options: { limit: Infinity }
    },
    {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-react',
                ["@babel/preset-env", { "modules": false, "targets": { "browsers": browsers } }]
            ]
        }
    },
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
    }
];

const config = {
    entry: {
        racer: './src/client/index',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '',
        library: 'racer',
        libraryTarget: 'var',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        modules: ['node_modules']
    },
    module: { rules },
    plugins: [],
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        inline: true,
        contentBase: 'public',
        overlay: {
            warnings: true,
            errors: true
        }
    }
};

module.exports = config;
