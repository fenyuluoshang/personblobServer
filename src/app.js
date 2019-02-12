const config = require('./config')
const fs = require('fs')
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data')
}
var NodeRSA = require('node-rsa')
if (!fs.existsSync('./key') || !fs.existsSync('./key/admin') || !fs.existsSync('./key/admin.pub')) {
    var key = new NodeRSA({
        b: 2048
    });
    fs.mkdirSync('./key')
    fs.writeFileSync('./key/admin', key.exportKey('pkcs8-private-pem'))
    fs.writeFileSync('./key/admin.pub', key.exportKey('pkcs8-public-pem'))
}
const port = config.server.port
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createError = require('http-errors');
const app = express();
const initgit = require('./git/initgit')

app.set('port', port);
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