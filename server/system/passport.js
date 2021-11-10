const passport = require("passport");
const User = require("../models/User");
const Patient = require("../models/Patient");
var { encrypt } = require("../services/CryptoService.js");
var config = require("../configs/config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const bcrypt = require("bcryptjs");
var passConfig = require("../configs/passport");

// Create local strategy
const localOptions = { usernameField: "username", passwordField: "password" };
const localLogin = new LocalStrategy(
  localOptions,
  (username, password, done) => {
    console.log(username, password);
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Invalid Username Or Password" });
      }
      console.log(user)
      // compare passwords - is `password` equal to user.password?
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          // throw err;
          console.log(err);
        }
        if (isMatch) {
          if (user.lastAttempt >= config.passwordAttempt) {
            return done(null, false, { message: "Invalid Username or Password.Please Reset Password and login" });
          } else {
            User.findByIdAndUpdate(user._id,
              { $set: { lastAttempt: 0 } }).then((result) => {
                return done(null, user);
              })
          }
        } else {
          User.findByIdAndUpdate(user._id,
            { $set: { lastAttempt: (user.lastAttempt + 1) } }).then((result) => {
              if ((user.lastAttempt + 1) >= config.passwordAttempt) {
                return done(null, false, { message: "Invalid Username or Password.Please Reset Password and login" });
              } else {
                var balAttempt = (config.passwordAttempt - (user.lastAttempt + 1));
                return done(null, false, { message: `Invalid Username or Password.You are left with ${balAttempt} more attempts.` });
              }
            })
        }
      });
    });
  }
);

// Custom Strategy
const customOptions = { emailField: "email", passwordField: "password" };
const patientLogin = new LocalStrategy(
  customOptions,
  (email, password, done) => {
    // console.log(encrypt(email), password);
    Patient.findOne({ email: encrypt(email) }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Patient Not found" });
      }

      // compare passwords - is `password` equal to user.password?
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          // throw err;
          console.log(err);
        }
        if (isMatch) {
          if (user.lastAttempt >= config.passwordAttempt) {
            return done(null, false, { message: "Invalid Username or Password.Please Reset Password and login" });
          } else {
            User.findByIdAndUpdate(user._id,
              { $set: { lastAttempt: 0 } }).then((result) => {
                return done(null, user);
              })
          }
        } else {
          User.findByIdAndUpdate(user._id,
            { $set: { lastAttempt: (user.lastAttempt + 1) } }).then((result) => {
              if ((user.lastAttempt + 1) >= config.passwordAttempt) {
                return done(null, false, { message: "Invalid Username or Password.Please Reset Password and login" });
              } else {
                var balAttempt = (config.passwordAttempt - (user.lastAttempt + 1));
                return done(null, false, { message: `Invalid Username or Password.You are left with ${balAttempt} more attempts.` });
              }
            })
        }
      });
    });
  }
);
// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: passConfig.jwtSecret,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in our database 
  User.findById(payload.sub, (err, user) => {
    if (err) {
      console.log(err);
      return done(err, false);
    }
    if (user) {
      // console.log(user)
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Create JWT strategy
const patientJWTLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in our database
  Patient.findById(payload.sub, (err, user) => {
    if (err) {
      console.log(err);
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(jwtLogin);
passport.use("local", localLogin);
passport.use("patient", patientLogin);
passport.use("patientJWT", patientJWTLogin); 
