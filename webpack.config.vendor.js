const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const treeShakableModules = [
    '@angular/animations',
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    'angular2-jwt',
    'angular-oauth2-oidc',
    '@ngx-translate/core',
    '@ng-bootstrap/ng-bootstrap',
    'rxjs',
    'zone.js',
];
const nonTreeShakableModules = [
    //'bootstrap/dist/css/bootstrap.css',
    //'font-awesome/css/font-awesome.css',
    //'./wwwroot/css/flags.css',
    //'core-js',
    'event-source-polyfill',
    /***************************************************************************************************
     * BROWSER POLYFILLS
     */

    /** IE9, IE10 and IE11 requires all of the following polyfills. **/
    /*'core-js/es6/symbol',
    'core-js/es6/object',
    'core-js/es6/function',
    'core-js/es6/parse-int',
    'core-js/es6/parse-float',
    'core-js/es6/number',
    'core-js/es6/math',
    'core-js/es6/string',
    'core-js/es6/date',
    'core-js/es6/array',
    'core-js/es6/regexp',
    'core-js/es6/map',
    'core-js/es6/set'*/
];

const allModules = treeShakableModules.concat(nonTreeShakableModules);

process.traceDeprecation = true;

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: ['.js'] },
        module: {
            rules: [
                //{ test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
                { 
                    test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            context: '',
                            publicPath: './'
                        }
                    } 
                }
            ]
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            //new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/14898
            //new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/14898
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            // To keep development builds fast, include all vendor dependencies in the vendor bundle.
            // But for production builds, leave the tree-shakable ones out so the AOT compiler can produce a smaller bundle.
            vendor: isDevBuild ? allModules : nonTreeShakableModules
        },
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        devtool: "source-map",
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader?sourceMap' : 'css-loader?minimize&sourceMap' }) }
            ]
        },
        plugins: [
            extractCSS,
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new UglifyJSPlugin()
        ])
    });

    const wowbookConfig = merge(sharedConfig, {
        entry: {
            //'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
            jquery: [
                'jquery',
                'hammerjs',
                './ClientApp/vendor/modernizr.js'
            ],
            wowbook: [
                './ClientApp/vendor/jquery/jquery.browser.js',
                './ClientApp/vendor/jquery/jquery.easing.custom.1.3.js',
                //'pdfjs-dist',
                './ClientApp/vendor/wowbook/wowbook.js'
            ]
        },
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        devtool: "source-map",
        module: {
            rules: [
                {test: /modernizr/, loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'},
                //{test: /wowbook/, loader: 'imports-loader?this=>jQuery!imports-loader?this=>$'},
                {
                    test: require.resolve('jquery'),
                    include: /node_modules/,
                    use: [
                        { loader: 'expose-loader', options: 'jQuery' },
                        { loader: 'expose-loader', options: '$' }
                    ]
                }
                //{ test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader?sourceMap' : 'css-loader?minimize&sourceMap' }) }
            ]
        },
        plugins: [
            // PdfJs needs the pdf worker to work. Pdf Worker script, however, could not use
            // pdfjs-dist/build/pdf.worker.entry to build the bundle by webpack (got error with UglifyJSPlugin)
            // therefore have to copy manually to dist/ folder instead.
            new CopyWebpackPlugin([
                { from: path.join(__dirname, 'node_modules', 'pdfjs-dist','build', 'pdf.worker.min.js'), to: path.join(__dirname, 'wwwroot', 'dist') }
            ]),
            //extractCSS,
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
        ].concat(isDevBuild ? [] : [
            new UglifyJSPlugin()
        ])
    });
    return [clientBundleConfig, wowbookConfig];
}
