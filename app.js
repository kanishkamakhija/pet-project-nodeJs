require("babel-polyfill");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const cookieEncrypter = require('cookie-encrypter')
let bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signUp = require('./routes/logIn');
var MongoClient = require('mongodb');
// const mpngoose = require('mongoose');
var {clientApiKeyValidation, isNewSessionRequired, isAuthrequired, generateJWTtoken, verifyToken} = require('./common/authUtils');
// const CONN_URL = 'mongodb://localhost:27017/myDb';
const CONN_URL = 'mongodb+srv://mongodb_user:Master@98@clusterjwt.tjt24.mongodb.net/sample_airbnb?retryWrites=true&w=majority'
let mongoClient = null;

MongoClient.connect(CONN_URL,{ useNewUrlParser: true }, function (err, client) {
    mongoClient = client;
    if (err) throw err;
    console.log("Database created!");
    db.close();
})


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.get('/', function(req, res) {
//   res.send('Hello Express');
//  });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req,res,next)=>{
  req.db = mongoClient.db('test');
  next();
});

app.use(clientApiKeyValidation);
app.use(async(req, res, next) => {
  let apiUrl = req.originalUrl;
  let httpMethod = req.method;
  req.session = {};

  if(isNewSessionRequired(httpMethod, apiUrl)) {
    req.newSessionRequired = true;
  }
  else if(isAuthrequired(httpMethod, apiUrl)) {
    let authHeader = req.header('Authorization');
    let sessionId = authHeader.split(' ')[1];
    if(sessionId){
      let userData = verifyToken(sessionId);
      if(userData) {
        req.session.userData = userData;
        req.session.sessionId = sessionId;
      }
      else {
        res.status(401).send({status: 401, error: "Invalid SessionToken"});
      }
    } else {
      res.status(401).send({status: 401, error: "Missing SessionToken"});
    }
  }
  next();
});

app.use('/users', usersRouter);
app.use((req, res, next) => {
  if(!res.data) {
    res.status(404).send({status: 401, error: "Invalid Endpoint"});
  }
  if(req.newSessionRequired && req.session.userData){
    try {
      res.setHeader('session-token', generateJWTtoken(req.session.userData));
      res.data['session-token'] = generateJWTtoken(req.session.userData);
    } catch(e) {
      console.log(e);
    }
  }

  if(req.session && req.session.sessionId) {
    try {
      res.setHeader('session-token', req.session.sessionId);
      res.data['session-token'] = req.session.sessionId
    } catch(e){
      console.log(e);
    }
  }
  res.status(res.status || 200).send({status: true, response: res.data});

});



 
 app.listen(3000, function() {
  console.log("Server is running at 3000 port!");
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

process.on('exit', (code) => {
  mongoClient.close();
  console.log(`About to exit with code: ${code}`);
});


process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  process.exit();
});

module.exports = app;
