var express = require("express");
var app = express();
var path = require("path");
var logger = require("morgan");
var config = require("./configs/config");
var cron = require("./cron");
var routes = require("./routes");
var home = require("./routes/home");
var users = require("./routes/users");
var patients = require("./routes/patients");
var doctors = require("./routes/doctors");
var appointments = require("./routes/appointments");
var payments = require("./routes/payments");
var videos = require("./routes/videos");
var patientUser = require("./routes/patient/users");
const AppService = require("./services/AppService.js");
const {jwtLogin} = require("./system/passport.js");
var cors = require("cors");
var bodyParser = require("body-parser");
var moment = require('moment-timezone');
var _ = require("lodash")

// moment.tz.setDefault(config.timeZone);
// Passport 
var passport = require("passport");
var passportSystem = require("./system/passport");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});
const JwtStrategy = require("passport-jwt").Stategy;

//Mongodb connections
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
//app.use(express.bodyParser({limit: '50mb'}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

/*Serve static files from the React app*/
//app.use(express.static(path.join(__dirname, '../reactjs/build')));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(cron);

app.all('/api/*', function (req, res, next) { 
  passport.authenticate(["jwt", "patientJWT"], function(err, user, info) {
    if (err) { return next(err); } 
    if(user){ 
      req.user = user;
      AppService.auditLog(req, "Auto Generated", true); 
    }
  })(req, res, next);  
  next()
})


//app.use("/", home);
app.use("/api", routes);
app.use("/api/patient/users", patientUser);
app.use("/api/users", users);
app.use("/api/doctor", doctors);
app.use("/api/patient", patients);
app.use("/api/video", videos);
app.use("/api/appointment", appointments);
app.use("/api/payment", payments); 

//to serve client facing site
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, 'build'))); 
  console.log(path.join(__dirname, '../build'))   

  app.use('/', express.static(path.join(__dirname, '../build'), { maxAge: 604800}));        

} else {
 // app.use('/', home)
 app.use('/', express.static(path.join(__dirname, '../build'), { maxAge: 604800}));     
  console.log('dev');
}
// React Production deployment
app.get('/*', function (request, response){ 
  response.sendFile(path.join(__dirname, '../build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) { 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use((error, req, res, next) => {
  // Error gets here
  res.json({
    message: error.message,
  });
});

module.exports = app;
