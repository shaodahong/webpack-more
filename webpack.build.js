require('shelljs/global');
env.NODE_ENV = 'production';

var Webpack = require('webpack');

rm('-rf', './dist/');

console.log(
  '  Tip:\n' +
  '  project start ...........'
)


var webpackConfig = require('./webpack.config.js');


Webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
