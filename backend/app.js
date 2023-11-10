var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./controllers/account');
var eventLogRouter = require('./controllers/eventLog');
var userRouter = require('./controllers/user');
<<<<<<< HEAD
=======
var cardRouter = require('./controllers/card');
var automatRouter = require('./controllers/automat');

>>>>>>> main
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account',accountRouter);
app.use('/eventLog', eventLogRouter);
app.use('/user', userRouter);
<<<<<<< HEAD

=======
app.use('/card', cardRouter);
app.use('/automat', automatRouter);
>>>>>>> main

module.exports = app;
