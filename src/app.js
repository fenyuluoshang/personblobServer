const config = require('./config')
var port = config.server.port

var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var createError = require('http-errors');
var app = express();
app.set('port', port);
const initgit = require('./git/initgit')
var apicentter

//post data json/x-www-form-urlencoded deal mideware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

init()

async function init() {
    await initgit()
    apicentter = require('./MainRouter')
    app.use(apicentter)
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });
    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.sendStatus(err.status || 500);
        // res.render('error');
    });
    app.listen(port, () => {
        console.log(`server start at ${port}`)
    })
}