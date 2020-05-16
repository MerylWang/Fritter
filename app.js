const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");

const indexRouter = require('./routes/index');
const freetsRouter = require('./routes/freets');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/dist'))); // Note


app.use(session({
  secret: "fritter-wangms",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  }
}));

app.use('/', indexRouter);
app.use('/freets', freetsRouter);
app.use('/users', usersRouter)

module.exports = app;
