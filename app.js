const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const handlebarsHelpers = require('handlebars-helpers');
const customHelpers = require('./config/customHelpers');
const exphbs = require('express-handlebars');
const azureJWT = require('azure-jwt-verify');
const verifier = require('google-id-token-verifier');

const moment = require('moment');

require('dotenv').config();

const app = express();


mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('✅ Successfully connected to MongoDB ' + process.env.DB_NAME))
    .catch(err => {
      console.log('🆘 Error occured: ' + err.message);
      process.exit(1)
    });

// view engine setup
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: {...handlebarsHelpers(), ...customHelpers},
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({
  credentials: true
}));
app.use(logger('dev'));
app.use(busboyBodyParser())
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'views_assets')));
app.use(cookieParser('jjlkkk'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'anything', resave: true,
  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.settings')(passport);

// AUTHENTICATION
app.use(async (req, res, next) => {
  let splittedUrl = req.originalUrl.split('/');
    if((splittedUrl.indexOf('api') >= 0) && splittedUrl.indexOf('login') < 0) {
      if(req.headers.authorization){
        const splittedToken = req.headers.authorization.split(' ');
        const provider = splittedToken[1];
        const token = splittedToken[2];
        if(provider === "google") {

          let clientID = process.env.TOKEN_STRATEGY_GOOGLE;

          verifier.verify(token, clientID, function (err, tokenInfo) {
              if(tokenInfo) {

                return req.next();
              } else {
                return res.status(500).send('Nejste autorizován');

              }

          });
        } else if(provider === "microsoft") {
          let microsoftUri = process.env.TOKEN_STRATEGY_MICROSOFT_URI
          let microsoftIss = process.env.TOKEN_STRATEGY_MICROSOFT_ISS
          let microsoftAud = process.env.TOKEN_STRATEGY_MICROSOFT_AUD
          azureJWT.verify(token, {JWK_URI: microsoftUri, ISS: microsoftIss,AUD: microsoftAud}).then(tokenResponse => {
            if(tokenResponse){
              return req.next();
            }
          }).catch(err => {
            return res.status(500).send(err);
          });
        } else {
          req.next();
        }
      } else {
        res.status(401).send('Nejste oprávněn pro tento přístup. <a href="/public">Vraťe se zpátky</a>')
      }
    } else {
      req.next();
    }

})

require('./routes/config.routes')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('✅ Server listening on port ' + server.address().port);
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let splittedUrl = req.originalUrl.split('/');
  if((splittedUrl.indexOf('public') >= 0)) {
    //redirect to main public page, when 404 on public routes
    res.status(err.status || 500);
    res.redirect('/');
  } else {
    // render the not found page, when 404 on api routes
    res.status(err.status || 500);
    res.render('error');
  }


});

module.exports = app;
