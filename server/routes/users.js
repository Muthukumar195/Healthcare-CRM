var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var Pusher = require("pusher");
var User = require("../models/User.js");
var Patient = require("../models/Patient.js");
var preferences = require("../models/Users.js");
const Appointment = require("../models/AppointmentModel.js");
const Availability = require("../models/AvailabilityModel.js");
const UrgentCareLogsModel = require("../models/UrgentCareLogsModel.js");
var { dataEncrypt, dataDecrypt } = require("../services/CryptoService.js");
const formidable = require("formidable");
var passport = require("passport");
var bCrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
var passConfig = require("../configs/passport");
var _ = require("lodash");
const nodemailer = require("nodemailer");
var config = require("../configs/config");
const bcrypt = require("bcryptjs");
const requireAuth = passport.authenticate(["jwt", "jwtPatient"], { session: false });
const fileUpload = require("express-fileupload");
const moment = require("moment");
var patientVirtual = new Patient();
const AppService = require("../services/AppService");
const AccessService = require("../services/AccessService");

const app = express();
const fs = require("fs");
// default options
app.use(fileUpload());

const pusher = new Pusher({
  appId: "491104",
  key: "325385c3016e317bfa77",
  secret: "9161bd2f9430dfc0f105",
  cluster: "ap2",
  encrypted: true,
});
const userSessionModel = {
  _id: null,
  prefix: null,
  firstName: null,
  lastName: null,
  suffix: null,
  fullName: null,
  companyInfo: "",
  userRole: "",
  email: null,
  gender: null,
  mobile: null,
  dateOfBirth: null,
  profileImage: null,
  isAvailableForUrgentCare: null,
};

router.post("/auditLog", AppService.authGuard, function (req, res, next) {
  // req.body.userId = AppService.session(req).userId;
  // req.body.userRole = AppService.session(req).userRole; 
  AppService.auditLog(req, req.body.action);
  res.json({
    status: true,
    message: "Audit Logged successfully!",
  });
});
//users list
router.post("/", requireAuth, (req, res) => {
  let Promise = require("bluebird");
  let params = req.body;
  console.log(params);
  let skip = params.page || 0;
  var perPage = params.pageSize || 5;
  var sorted = "-createdAt";
  var query = { $and: [{ isDeleted: false }] };
  if (req.body.filtered && req.body.filtered.length > 0) {
    var multifilters = [];
    req.body.filtered.map((filter) => {
      if (filter.id === "fullName") {
        multifilters.push({
          fullName: { $regex: new RegExp(filter.value, "i") },
        });
      }
      if (filter.id === "email") {
        multifilters.push({ email: { $regex: new RegExp(filter.value, "i") } });
      }
      if (filter.id === "companyInfo") {
        multifilters.push({
          companyInfo: { $regex: new RegExp(filter.value, "i") },
        });
      }
    });
    query = Object.assign(query.$and[0], { $or: multifilters });
  }
  if (params.sorted && params.sorted.length > 0) {
    let sort = params.sorted[0];
    if (sort.desc) {
      sorted = "-" + sort.id;
    } else {
      sorted = sort.id;
    }
  }
  console.log(query);
  Promise.all([
    User.find(query)
      .limit(perPage)
      .skip(perPage * skip)
      .sort(sorted)
      .exec(),
    User.find(query).count().exec(),
  ]).spread(
    function (users, count) {
      res.json({
        users: users,
        count: count,
      });
    },
    function (err) {
      console.log(err);
    }
    );
});
//Add user
router.post("/addUser", function (req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      console.log(user);
      res.json({ status: false, message: "Email ID Already exist" });
    } else {
      var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fullName: req.body.firstName + " " + req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        mobile: req.body.mobile,
        password: createHash(req.body.password),
        isDeleted: false,
      });
      newUser
        .save()
        .then((user) => {
          pusher.trigger("user-channel", "user-event", {
            message: "One new user added",
          });
          res.json({
            status: true,
            message: "Signed up successfully! Please login",
          });
        })
        .catch((err) => {
          console.log(err);
          return next(err);
        });
    }
  });
});

//Edit user
router.post("/editUser", function (req, res, next) {
  let userId = req.body.userId;
  var updateUser = {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: req.body.firstName + " " + req.body.lastName,
      companyInfo: req.body.company,
    },
  };

  User.findByIdAndUpdate(userId, updateUser, { new: true }, function (
    err,
    user
  ) {
    if (err) {
      res.json({
        success: false,
        message: "Something wrong when updating data!",
      });
    } else {
      res.json({ success: true, message: "User Updated successfully!" });
    }
  });
});

router.post("/updateProfile", function (req, res, next) {
  let userId = req.body.userId;

  var updateUser = {
    $set: {
      prefix: req.body.prefix,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      suffix: req.body.suffix,
      fullName: req.body.firstName + " " + req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      mobile: req.body.mobile,
    },
  };
  console.log(updateUser);

  User.findByIdAndUpdate(userId, updateUser, { new: true }, function (
    err,
    user
  ) {
    if (err) {
      res.json({
        status: false,
        message: "Something wrong when updating data!",
      });
    } else {
      var userSession = _.pick(user, _.keys(userSessionModel));
      res.json({
        status: true,
        message: "Profile updated successfully!",
        user: userSession,
      });
    }
  });
});

router.delete("/deleteUser/:userId", (req, res, next) => {
  let userId = req.params.userId;
  User.findByIdAndUpdate(
    userId,
    { isDeleted: true, deleted_at: new Date() },
    (err, user) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.json({ success: true, message: "User deleted successfully!" });
    }
  );
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err);
    }
    if (!user) {

      return res.json({ status: false, message: info.message });
    } else {
      var token = tokenForUser(user._id);
      var userSession = _.pick(user, _.keys(userSessionModel));
      var update = { doctorId: user._id };
      var options = { upsert: true, new: true, setDefaultsOnInsert: true, returnOriginal: false };
      Availability.findOneAndUpdate({ doctorId: user._id }, update, options).lean().exec((err, avail) => {
        if (err) {
          console.log(err)
        } else {
          userSession.isAvailableForUrgentCare = avail.urgentCare
        }
      });

      User.findByIdAndUpdate(user._id,  
        { $set: { lastLogin: moment().toDate(), timeZone: req.body.timeZone } }).then((err, result) => {
          req.body.message = `${AppService.crossTxt(user.email)}`;
          AppService.auditLog(req, "Logged In");
          return res.json({
            status: true,
            message: "login success",
            token: token,
            user: userSession,
          });
        })
    }
  })(req, res, next);
});

router.post("/patientLogin", function (req, res, next) {
  passport.authenticate("patient", function (err, user, info) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.json({ status: false, message: info.message });
    } else {
      console.log(user.isMobileVerified)
      var auth = false;
      if (user.verifyMode == 1) {
        if (user.isEmailVerified && user.isMobileVerified) {
          auth = true;
        } else {
          return res.json({
            status: false,
            message: "Please verify both Email Adrress and Mobile number",

          });
        }
      } else if (user.verifyMode == 2) {
        if (user.isEmailVerified) {
          auth = true;
        } else {
          return res.json({
            status: false,
            message: "Please verify your Email Address",
          });
        }
      } else {
        if (user.isMobileVerified) {
          auth = true;
        } else {
          return res.json({
            status: false,
            message: "Please verify your Mobile number",

          });
        }
      }

      if (auth) {
        var redirect = "/patient-intake";
        if (!_.isEmpty(req.body.appointmentId)) {
          Appointment.find({ _id: req.body.appointmentId, patientId: user._id }).count(function (err, count) {
            if (count > 0) {
              redirect = `/telescrubs/appointments/${req.body.appointmentId}`;
            }
          });
        }
        var token = tokenForUser(user._id);
        var userSession = _.pick(user, _.keys(userSessionModel));
        dataDecrypt(userSession, { in: patientVirtual.encryptFields })
        Patient.findByIdAndUpdate(user._id,
          { $set: { lastLogin: moment().toDate(), timeZone: req.body.timeZone } }).then((err, result) => {
            req.user = user; 
            req.body.message = `${AppService.crossTxt(req.body.username)}`;
            AppService.auditLog(req, "Logged In");
            return res.json({
              status: true,
              message: "login success",
              token: token,
              user: userSession,
              redirect: redirect
            });
          })
      }

    }
  })(req, res, next);
});

router.get("/userByEmail", function (req, res, next) {
  console.log("in userByEmail");
  var q = req.query.email;
  User.findOne({
    isDeleted: false,
    email: q,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      res.json({
        message: "found email",
        result: true,
      });
    } else {
      res.json({
        message: "email not found",
        result: false,
      });
    }
  });
});

router.post("/forgotPassword", function (req, res, next) {
  var email = req.body.email;
  User.findOne({
    isDeleted: false,
    email: email,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      console.log(user);
      var formData = {};
      formData.token = createHash(user.email).replace(/\\|\//g, "");
      formData.email = user.email;
      var updateUser = {
        $set: {
          forgotPassword: formData.token,
        },
      };
      User.findByIdAndUpdate(user._id, updateUser, { new: true }, function (
        err,
        updatedUser
      ) {
        if (err) {
          console.log(err);
        } else {
          forgotPasswordMail(updatedUser, (result) => {
            if (result) {
              res.json({
                status: true,
                message: "An email with a link to reset the password has been sent!",
              });
            } else {
              res.json({ status: false, message: "Forgot password failed!" });
            }
          });
        }
      });
    } else {
      res.json({
        message: "Enter registered email address",
        status: false,
      });
    }
  });
});

router.post("/updatePassword", function (req, res, next) {
  var formData = req.body;

  User.findOne({
    isDeleted: false,
    _id: formData.userId,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      console.log(user);
      bcrypt.compare(formData.oldPassword, user.password, (err, isMatch) => {
        if (err) {
          // throw err;
          console.log(err);
        }
        if (isMatch) {
          var updateUser = {
            $set: {
              password: createHash(formData.password),
            },
          };
          User.findByIdAndUpdate(user._id, updateUser, { new: true }, function (
            err,
            updatedUser
          ) {
            if (err) {
              console.log(err);
            } else {
              if (updatedUser) {
                res.json({
                  status: true,
                  message: "Password updated successfully !",
                });
              } else {
                res.json({
                  status: false,
                  message: "Password update failed!",
                });
              }
            }
          });
        } else {
          res.json({
            status: false,
            message: "Current password doesn't match",
          });
        }
      });
    } else {
      res.json({
        message: "User not registered",
        status: false,
      });
    }
  });
});

router.post("/resetPassword", function (req, res, next) {
  var forgotToken = req.body.forgotToken;
  var password = req.body.new_password;
  User.findOne({
    forgotPassword: forgotToken,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      console.log(user);
      var updateUser = {
        $set: {
          password: createHash(password),
          forgotPassword: "",
          lastAttempt:0
        },
      };
      User.findByIdAndUpdate(user._id, updateUser, { new: true }, function (
        err,
        updatedUser
      ) {
        if (err) {
          res.json({ status: false, message: "Password reset failed!" });
        } else {
          res.json({
            status: true,
            message: "Password reset successfully !",
          });
        }
      });
    } else {
      res.json({
        message: "Invalid Link",
        status: false,
      });
    }
  });
});

router.get("/fetchOneUser/:userId", (req, res, next) => {
  console.log("fetchOneUser");
  let userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json(user);
  });
});

function tokenForUser(userId) {
  return jwt.encode({ sub: userId }, passConfig.jwtSecret);
}

// Generates hash using bCrypt
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var forgotPasswordMail = (formData, callback) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: config.mailCredential,
  });
  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: formData.email,
      subject: "Link to Reset Your TeleScrubs Login Password",
      html: `<b>Dear ${formData.lastName}, ${formData.firstName},</b><br/>
      <p>Your request for the reset password has been received. <a href="${config.baseUrl}/reset-password/${formData.forgotPassword}" title="forgot link">Click here to reset your password.</a> This link expires
      in 60 minutes. If you have not requested for password reset, please
      contact <a href="mailto:info@telescrubs.com">info@telescrubs.com</a><br/><br/>
      Thanks,<br/>
      TeleScrubs Team</p>`,
    },
    function (error, info) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        callback(true);
      }
    }
  );
};

router.post("/uploadProfilePicture", requireAuth, function (req, res, next) {
  var uploadDir = config.file.uploadDir + "/profilePic";
  var form = new formidable.IncomingForm(config.file);
  var fileName = "";
  form.on("file", function (field, file) {
    fileName = req.user._id + ".png";
    fs.rename(file.path, uploadDir + "/" + fileName, function (err) {
      if (err) throw err;
      console.log('renamed complete');
    });
  });
  form.parse(req, (err, fields, files) => {
    var updateUser = {
      $set: {
        profileImage: req.user._id + ".png",
      },
    };
    console.log(updateUser);

    User.findByIdAndUpdate(req.user._id, updateUser, { new: true }, function (
      err,
      user
    ) {
      if (err) {
        res.json({
          status: false,
          message: "Something wrong when updating data!",
        });
      } else {
        var userSession = _.pick(user, _.keys(userSessionModel));
        userSession.profileImage =
          userSession.profileImage + "?" + moment().unix();
        res.json({
          status: true,
          message: "Profile picture updated successfully.",
          user: userSession,
        });
      }
    });
  });
});

router.post("/updatePreferences", requireAuth, function (req, res, next) {
  var query = { providerId: req.user._id };
  if (req.body.emrPreferenceId != "" || req.body.paymentPreferenceId != "") {
    req.body.iframeLink =
      req.body.emrPreferenceId == 2 ? req.body.iframeLink : "";
    req.body.feePerVisit =
      req.body.paymentPreferenceId == 2 ? req.body.feePerVisit : "";
    req.body.hasSkipPayment =
      req.body.paymentPreferenceId == 2 ? req.body.hasSkipPayment : false;

    preferences.findOneAndUpdate(query, req.body, { upsert: true }, function (
      err,
      doc
    ) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: true,
          message: "Preferences updated successfully",
          data: req.body,
        });
      }
    });
  } else {
    res.json({
      status: false,
      message: "Please select atleast any one preference",
    });
  }
});

router.get("/getPreferences", requireAuth, function (req, res, next) {
  var query = { providerId: req.user._id };
  preferences.findOne(query, function (err, data) {
    if (err) {
    } else {
      res.json({
        status: true,
        data: data,
      });
    }
  });
});



router.post("/access", AppService.authGuard, function (req, res, next) {
  AccessService.appointmentAccess(req, {
    patientId: AppService.session(req).userId,
    _id: req.body.id
  }, (access) => {
    res.json({
      status: access,
      message: "Appointment Access!",
    });
  })
});

router.post("/setUrgentCareStatus", requireAuth, function (req, res, next) {
  var update_params = { urgentCare: req.body.status, lastActivity: moment().toDate() };
  var query = { _id: req.user._id };
  var userSession = _.pick(req.user, _.keys(userSessionModel));
  Appointment.find({ doctorId: req.user._id, createdByDoctor: false, status: "Scheduled" }).count(function (err, count) {
    if (!req.body.status && count > 0) {
      userSession.isAvailableForUrgentCare = !req.body.status;
      res.json({
        status: false,
        message: "doctor appointment available!!!!",
        appointmentAvailable: true,
        user: userSession

      });
    } else {
      Availability.findOneAndUpdate({ doctorId: req.user._id }, update_params, { upsert: true }, function (
        err,
        user
      ) {
        if (err) {
          req.body.message = "Urgent Care update Failed";
           AppService.auditLog(req, "M3 Urgent Care")
          res.json({
            status: false,
            message: "Urgent Care status not set!",
          });
        } else {
          userSession.isAvailableForUrgentCare = req.body.status;
          if (req.body.status) {
            UrgentCareLogsModel.create({ doctorId: mongoose.Types.ObjectId(req.user._id) }, (err, logs) => {
              req.body.message = `Urgent Care ${(req.body.status)? "Enabled": "Disabled"}`;
              AppService.auditLog(req, "M3 Urgent Care")
              res.json({
                status: true,
                message: "Urgent Care Status set successfully!!!",
                appointmentAvailable: false,
                user: userSession

              });
            })
          } else {
            UrgentCareLogsModel.deleteOne({ doctorId: mongoose.Types.ObjectId(req.user._id) }, (err, logs) => {
              req.body.message = `Urgent Care ${(req.body.status)? "Enabled": "Disabled"}`;
              AppService.auditLog(req, "M3 Urgent Care")
              res.json({
                status: true,
                body_status: req.body.status,
                message: "Urgent Care Status set successfully!!!!",
                appointmentAvailable: false,
                user: userSession
              });
            })
          }
        }
      });
    }
  });



});

module.exports = router;
