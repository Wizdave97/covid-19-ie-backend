var createError = require('http-errors');
const fs = require('fs');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSanitizer = require("express-sanitizer");
const cors = require("cors");

var indexRouter = require('./routes/index');
var logsRouter = require('./routes/logs');

var app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger(function (tokens, req, res) {
  return [
    tokens.method(req, res),'\t',
    tokens.url(req, res),'\t',
    tokens.status(req, res),'\t',
    Math.floor(tokens['response-time'](req, res))
  ].join(' ')+'ms'
}, { stream: accessLogStream}));
app.use(express.json());
app.use(expressSanitizer());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/v1/on-covid-19', indexRouter);
app.use('/api/v1/on-covid-19/logs', logsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
