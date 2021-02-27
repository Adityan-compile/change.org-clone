var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var hbs = require('express-handlebars');
var handleBars = require('handlebars');
const {flash} = require('express-flash-message');
var Promise = require('promise');

env = require('dotenv').config();

if (env.error) {
  console.log('Error Loading Environment Variables');
  throw env.error;
} else {
  console.log('Environment Variables Loaded Successfully');
}

var indexRouter = require('./routes/index');
var petitionsRouter = require('./routes/petitions');

// Configure db
var db = require('./config/connection');

// Initialize app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layout',
    partialsDir: __dirname + '/views/partials',
  })
);

// Configure helpers for templates
handleBars.registerHelper('percentage', (signed, goal) => {
  return (signed / goal) * 100;
});

handleBars.registerHelper('calcAmount', (amount) => {
  return amount * 100;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    cookie: {
      maxAge: 2592000000,
    },
    saveUninitialized: false,
    resave: true,
  })
);

// apply express-flash-message middleware
app.use(flash({sessionKeyName: 'flashMessage'}));

app.use(express.static(path.join(__dirname, 'public')));

db.connect((err) => {
  if (err) {
    console.log('Database connection error');
    console.log(err);
  } else {
    console.log('Database Connected');
  }
});

app.use('/', indexRouter);
app.use('/petitions', petitionsRouter);

// catch error and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  next(createError(500));
});

app.use(function (req, res, next) {
  next(createError(400));
});

app.use(function (req, res, next) {
  next(createError(405));
});

app.use(function (req, res, next) {
  next(createError(429));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout: false});
});

module.exports = app;
