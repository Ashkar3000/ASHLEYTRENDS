var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let Hbs = require('handlebars')

var session=require('express-session')
var hbs =require('express-handlebars')

var db=require('./configure/connection')

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views',partialsDir:__dirname+'/views/partials/'}))

// handlebar Indexin

Hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

Hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Hbs.registerHelper('if_eq', function (a, b, opts) {
  if (a == b)
    // Or === depending on your needs
    return opts.fn(this);
  else return opts.inverse(this);
});

Hbs.registerHelper('if_Neq', function (a, b, opts) {
  if (a != b)
    // Or === depending on your needs
    return opts.fn(this);
  else return opts.inverse(this);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:"secret-key",
  cookie:{maxAge:1000*60*60*24},
  resave:false,
  saveUninitialized:true
}))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

db.connect((err)=>{
  if(err)
  console.log("Connection Error"+err);
  else
  console.log("Database Connected to port 27017");
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

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
