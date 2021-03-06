var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var Settings = require('./settings')
var MongoStore = require('connect-mongo')(session)

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
var ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
//app.engine('html', ejs.renderFile)
//app.set('view engine', 'html');
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 3600000 },
  secret: Settings.COOKIE_SECRET,
  store: new MongoStore({
    url: Settings.URL,
    db: Settings.DB
  }),
  resave: false,
  saveUninitialized: false
}))

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if(err) {
    res.locals.message = err;
  }
  next();
});

app.use('/', routes);
app.use('/u', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
