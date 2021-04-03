const cors = require('cors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');

var api = require('./routes/api');
var app = express();
app.use(cors());

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, {
    promiseLibrary: require('bluebird'),
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(passport.initialize());

app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  'extended': 'false',
  limit: '50mb'
}));

app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb'
}));

app.use(express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/houses', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/houses/:id', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/login', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/posts', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/users', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/users/edit/:id', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/users/create', express.static(path.join(__dirname, 'dist', 'dashboard')));
app.use('/api', api);
app.use('/api/users', require('./routes/users'));
app.use('/api/houses', require('./routes/houses'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/payments', require('./routes/payments'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
