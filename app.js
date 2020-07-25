require("babel-polyfill");
require('./db/mongoose');

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let indexRouter = require('./routes/index');
let task = require('./routes/taskRouter');
let register = require('./routes/register');
let signIn = require('./routes/signIn');
let app = express();

let {clientApiKeyValidation, isNewSessionRequired, isAuthrequired, generateJWTtoken, verifyToken} = require('./common/authUtils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// app.use('/', indexRouter);
app.get('/', (req, res, next) => {
  res.status(200).send({
    status: true,
    response: "HELLO WORLD"
  })
});
// app.use('/users', usersRouter);
app.use(register);
app.use(signIn);
app.use(task);


// app.use(clientApiKeyValidation);
// app.use(async(req, res, next) => {
//   let apiUrl = req.originalUrl;
//   let httpMethod = req.method;
//   req.session = {};

//   if(isNewSessionRequired(httpMethod, apiUrl)) {
//     req.newSessionRequired = true;
//   }
//   else if(isAuthrequired(httpMethod, apiUrl)) {
//     let authHeader = req.header('Authorization');
//     let sessionId = authHeader.split(' ')[1];
//     if(sessionId){
//       let userData = verifyToken(sessionId);
//       if(userData) {
//         req.session.userData = userData;
//         req.session.sessionId = sessionId;
//       }
//       else {
//         res.status(401).send({status: 401, error: "Invalid SessionToken"});
//       }
//     } else {
//       res.status(401).send({status: 401, error: "Missing SessionToken"});
//     }
//   }
//   next();
// });


// app.use((req, res, next) => {
//   console.log(req, res);
//   if(!res.data) {
//     res.status(404).send({status: 401, error: "Invalid Endpoint"});
//   }
//   if(req.newSessionRequired && req.session.userData){
//     try {
//       res.setHeader('session-token', generateJWTtoken(req.session.userData));
//       res.data['session-token'] = generateJWTtoken(req.session.userData);
//     } catch(e) {
//       console.log(e);
//     }
//   }

//   if(req.session && req.session.sessionId) {
//     try {
//       res.setHeader('session-token', req.session.sessionId);
//       res.data['session-token'] = req.session.sessionId
//     } catch(e){
//       console.log(e);
//     }
//   }
//   res.status(res.status || 200).send({status: true, response: res.data});
// });

 app.listen(3000, function() {
  console.log("Server is running at 3000 port!");
 });
 
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  process.exit();
});

module.exports = app;
