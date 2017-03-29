// server.js
// 依赖项
const express = require('express');
const path = require('path');
const opn = require('opn');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
// const proxy = require('express-http-proxy');

const config = require('./webpack.config.js');
const isDeveloping = true;
const port = isDeveloping ? 8000 : process.env.PORT;

const app = express();

if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: config.output.path,
        hot: true,
	    stats: {
	      colors: true,
	      hash: false,
	      timings: true,
	      chunks: false,
	      chunkModules: false,
	      modules: false
	    }
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.use(express(path.join(__dirname + './dist/')));
    app.use(history());
    // app.get('*', function response(req, res) {
    //     res.sendFile(path.join(__dirname + '/server/view/index.html'));
    // });
}

app.listen(port, function onStart(err) {
    if (err) {
        console.log(err);
    }
    var uri='http://localhost:'+port;
    opn(uri);
}
)
