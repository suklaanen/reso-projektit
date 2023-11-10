var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./controllers/account');
var eventLogRouter = require('./controllers/eventLog');
var userRouter = require('./controllers/user');
var cardRouter = require('./controllers/card');
var automatRouter = require('./controllers/automat');
var loginRouter = require('./controllers/login');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account',accountRouter);
app.use('/eventLog', eventLogRouter);
app.use('/user', userRouter);
app.use('/card', cardRouter);
app.use('/automat', automatRouter);

module.exports = app;
