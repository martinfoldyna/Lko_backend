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
const fileUpload = require('express-fileupload');
const mongoConfig = require('./config/mongo.settings');
const busboyBodyParser = require('busboy-body-parser');
const handlebarsHelpers = require('handlebars-helpers');
const customHelpers = require('./config/customHelpers');
const exphbs = require('express-handlebars');

// const MomentHandler = require('handlebars.moment')();


const moment = require('moment');

require('dotenv').config();

const app = express();

// app.use(multer({dest:'./uploads/'}).any());

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('✅ Successfully connected to MongoDB ' + process.env.DB_NAME))
    .catch(err => {
      console.log('🆘 Error occured: ' + err.message);
      process.exit(1)
    });

// mongoConfig.connectToDb((err, client) =>{
//   if(err) console.log('🆘 Error occured: ' + err.message)
//   console.log('✅ Successfully connected to MongoDB ' + process.env.DB_NAME)
//
// })

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
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(path.join(__dirname, 'views_assets')));
app.use(cookieParser('jjlkkk'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'anything', resave: true,
  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.settings')(passport);
app.use(function(req, res, next){
  res.locals.user = req.user || null
  next();


})


require('./routes/config.routes')(app);

// app.use(fileUpload());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('✅ Server listening on port ' + server.address().port);
  console.log('✅ Visit http://localhost:' + server.address().port + '/public/ for public site');
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  let splittedUrl = req.originalUrl.split('/');
  if(splittedUrl.indexOf('public') >= 0) {
    //redirect to main public page, when 404 on public routes
    res.status(err.status || 500);
    res.redirect('/public/');
  } else {
    // render the not found page, when 404 on api routes
    res.status(err.status || 500);
    res.render('error');
  }


});

module.exports = app;
