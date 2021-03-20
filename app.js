var path = require('path')
var fs = require('fs')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
var opn = require('opn')
var compression = require('compression')

// default port where dev server listens for incoming traffic
var port = '8130'
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

var app = express()
app.use(compression());

// proxy api requests

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve pure static assets
var staticPath = './'
app.use('/', express.static(staticPath))

// 路由
app.get('/:viewname?', function(req, res, next) {

    var viewname = req.params.viewname
        ? req.params.viewname + '.html'
        : 'index.html';

    var filepath = path.join('./', viewname);

    // 使用webpack提供的outputFileSystem
    fs.readFile(filepath, function(err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});


module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
    opn(uri)
})