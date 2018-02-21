const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ATL = require('awesome-typescript-loader');
const CheckerPlugin = ATL.CheckerPlugin;
const TsConfigPathsPlugin = ATL.TsConfigPathsPlugin;
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const extractCssModule = new ExtractTextPlugin('[name].css');


// 
// If got the error message while webpack building like "DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56".
// uncomment out bellow line to find out which loader is causing this deprecation warning
process.traceDeprecation = true;

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: {
            extensions: ['.js', '.ts'], plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        output: {
            filename: '[name].js',
            publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                {
                    test: /\.ts$/, include: /ClientApp/, use: isDevBuild ? [
                        'awesome-typescript-loader?silent=true', 
                        'angular2-template-loader', 
                        'angular2-router-loader'
                    ]: '@ngtools/webpack'
                },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { 
                    test: /\.(jpg|png|gif)$/, 
                    use: {
                        loader: 'file-loader',
                        options: {
                            context: '',
                            publicPath: './'
                        }
                    } 
                },
                { 
                    test: /\.(woff|woff2|eot|ttf|svg)$/, 
                    use: {
                        loader: 'file-loader',
                        options: {
                            context: '',
                            publicPath: './'
                        }
                    }  
                },
                //{ test: /\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                //{ test: /\.scss$/, use: ['to-string-loader', 'css-loader', 'sass-loader'] }
                { test: /\.css$/, use: extractCssModule.extract({ fallback: "style-loader", use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] }) },
                { test: /\.(scss|sass)$/, use: extractCssModule.extract({ fallback: 'style-loader', use: ['to-string-loader', 'css-loader', 'sass-loader'] }) }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(true)
        ]
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: { 
            'main-client': './ClientApp/main.ts'
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            extractCssModule,
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin(),
                new AngularCompilerPlugin({
                    tsConfigPath: './tsconfig.json',
                    entryModule: path.join(__dirname, 'ClientApp/app/app.module#AppModule')
                })
            ])
    });

    return [clientBundleConfig];
};
