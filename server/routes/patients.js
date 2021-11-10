const express = require("express");
const router = express.Router();
const _ = require("lodash"); 
const async = require("async");
const Nexmo = require("nexmo");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const fs = require("fs"); 
const assert = require("assert");
const formidable = require("formidable");
const readXlsxFile = require("read-excel-file/node");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Video = require("../models/Video.js");
const ICD = require("../models/IcdModel");
const IntakeForm = require("../models/IntakeForm.js");
var config = require("../configs/config");
var bCrypt = require("bcrypt-nodejs");
const nexmo = new Nexmo(config.nexmo);
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const AppService = require("../services/AppService.js");
const { visitFormValidation } = require("../services/ValidationService");
var { listDecryption, dataDecrypt, decrypt, encrypt } = require("../services/CryptoService");
const AppointmentService = require("../services/AppointmentService"); 
const PatientVisitForm = require("../models/PatientVisitFormModel");
const Appointment = require("../models/AppointmentModel");
var patientVirtual = new Patient();
const requirePatientAuth = passport.authenticate("patientJWT", {
  session: false,
});

const userSessionModel = {
  _id: null,
  firstName: null,
  lastName: null,
  fullName: null,
  email: null,
  gender: null,
  mobile: null,
  address: null,
  dateOfBirth: null,
};

router.get("/", requireAuth, function (req, res, next) {
  console.log(req.user);
  Patient.find({ isDeleted: false, providerId: req.user._id }).exec(
    (err, patients) => {
      if (err) {
        console.log(err);
      }
      if (patients) {
        res.json({
          status: true,
          message: "Patient List",
          data: listDecryption(patients, patientVirtual.encryptFields),
        });
      }
    }
  );
});

router.post("/sendInvite", requireAuth, update_link, function (req, res, next) { 
  
  createSession(req.body, (result) => {
    if (result.status) {
      // update_link(req.body, user,(result) => { 
      let formData = req.body;
      let user = req.user;
      user.timeZone = req.body.timeZone;
      var sessionData = new Video({
        sessionId: result.sessionId,
        email: req.body.email,
        mobile: req.body.mobile,
        providerId: req.user._id,
        patientId: req.body.patientId != "" ? req.body.patientId : null,
      });
      sessionData
        .save()
        .then((sessionData) => {
          var doctorLink = config.inviteLink + "/" + sessionData._id;
          var patientLink = config.inviteLink + "/" + sessionData._id;
          console.log("Session inserted");
          console.log("Patient Id", req.body.patientId);
          if (formData.inviteOption == 1) {
            inviteMail(req.body, user, patientLink, (result) => {
              if (result) {
                console.log(result);
                res.json({
                  status: true,
                  message: "Email sent successfully !",
                  inviteLink: doctorLink,
                });
                req.body.message = `${AppService.crossTxt(req.body.email)}, Status: Sent`;
                AppService.auditLog(req, "M1: IS");
              } else {
                req.body.message = `${AppService.crossTxt(req.body.email)}, Status: Failed`;
                AppService.auditLog(req, "M1: IF");
                res.json({ status: false, message: "Email send failed!" });
              }
            });
          } else if (formData.inviteOption == 2) {
            inviteSMS(req.body, user, patientLink, (result) => {
              if (result) {
                res.json({
                  status: true,
                  message: "Text message sent successfully!",
                  inviteLink: doctorLink,
                });
                req.body.message = `${AppService.crossTxt(req.body.mobile)}, Status: Sent`;
                AppService.auditLog(req, "M1: IS");
              } else {
                res.json({
                  status: false,
                  message: "Text message send failed!",
                });
                req.body.message = `${AppService.crossTxt(req.body.mobile)}, Status: Failed`;
                AppService.auditLog(req, "M1: IF");
              }
            });
          } else if (formData.inviteOption == 3) {
            Patient.find({ _id: req.body.patientId }).exec((err, patients) => {
              if (err) {
                console.log(err);
              }
              if (patients) {
                console.log(patients);
                let patient = patients[0];
                if (patient.inviteType == 1 || patient.inviteType == 3) {
                  patient.email = decrypt(patient.email);
                  inviteMail(patient, user, patientLink, (result) => { 
                    if (result) {
                      if (patient.inviteType == 3) {
                        res.json({
                          status: true,
                          message: "Email and Text mesasge sent successfully!",
                          inviteLink: doctorLink,
                        });
                        req.body.message = `${AppService.crossTxt(patient.email)}, ${AppService.crossTxt(patient.mobile)}, Status: Email and Text mesasge sent`;
                        AppService.auditLog(req, "M1: IS");
                      } else {
                        res.json({
                          status: true,
                          message: "Email sent successfully!",
                          inviteLink: doctorLink,
                        });
                        req.body.message = `${AppService.crossTxt(patient.email)}, Status: Sent`;
                        AppService.auditLog(req, "M1: IS");
                      }
                    } else {
                      res.json({ status: false, message: "Email send failed!" });
                      req.body.message = `${AppService.crossTxt(patient.email)}, Status: Failed`;
                      AppService.auditLog(req, "M1: EF");
                    }
                  });
                }
                if (patient.inviteType == 2 || patient.inviteType == 3) {
                  patient.mobile = decrypt(patient.mobile);
                  console.log(patient.mobile)
                  inviteSMS(patient, user, patientLink, (result) => {
                    if (patient.inviteType == 2) {
                      if (result) {
                        res.json({
                          status: true,
                          message: "SMS sent successfully !",
                          inviteLink: config.inviteLink,
                        });
                        req.body.message = `${AppService.crossTxt(patient.email)}, Status: Sent`;
                        AppService.auditLog(req, "M1: IS");
                      } else {
                        res.json({
                          status: false,
                          message: "SMS send failed!",
                        });
                        req.body.message = `${AppService.crossTxt(patient.email)}, Status: Failed`;
                        AppService.auditLog(req, "M1: IF");
                      }
                    }
                  });
                }
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return next(err);
        });
    } else {
      res.json({
        status: false,
        message:
          "Something went wrong!.Please contact TeleScrubs Administrator",
      });
      req.body.message = `${AppService.crossTxt(req.body.email)}, ${AppService.crossTxt(req.body.mobile)}, Status: Email and Text mesasge sent, Reason: Something went wrong!.Please contact TeleScrubs Administrator`;
      AppService.auditLog(req, "MVP1:  Invite Failed");
    }
  });
});
function update_link(req, res, next) {
  console.log("request", req.body);

  if (req.body.patientId == "") {
    if (req.body.inviteOption == 1) {
      var searchData = {
        email: req.body.email,
        providerId: req.user._id,
      };
    } else {
      var searchData = {
        mobile: req.body.mobile,
        providerId: req.user._id,
      };
    }
  } else {
    var searchData = {
      patientId: req.body.patientId,
      providerId: req.user._id,
    };
  }
  console.log("filter", searchData);
  Video.update(searchData, { linkStatus: 2 }, { multi: true }).exec(
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updated", data);
      }
    }
  );

  // Video.findOne(searchData).exec((err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {

  //   }
  // });
  next();
}
var createSession = (formData, callBack) => {
  var OpenTok = require("../lib/opentok");
  var apiKey = "46761672";
  var apiSecret = "76399a43b069914d98adcdc1a76fac5540497fd0";
  opentok = new OpenTok(apiKey, apiSecret);
  opentok.createSession(function (err, session) {
    var sessionID = 0;
    var sessionStatus = false;
    if (!_.isEmpty(session)) {
      if (!_.isEmpty(session.sessionId)) {
        sessionID = session.sessionId;
        sessionStatus = true;
      } else {
        console.log("session--->", session.sessionId);
        sessionID = null;
        sessionStatus = false;
      }
    } else {
      sessionID = null;
      sessionStatus = false;
    }
    callBack({ status: sessionStatus, sessionId: sessionID });
    if (err){
      throw err;
    } 
  });
};

var inviteSMS = (formData, user, patientLink, callBack) => {
  const from = "13048738828";
  const to = config.countryNumberCode + formData.mobile;
  console.log(to);
  const text = `Dear Member,\nYou have an appointment with Dr. ${
    user.firstName
    } ${user.lastName} on ${moment()
      .tz(user.timeZone)
      .format("MMM DD, YYYY, hh:mm:ss A")} - ${moment().tz(user.timeZone).format('z')}. \n
Click here to connect: ${patientLink} \n
Regards,\nTeleScrubs Team`;
  nexmo.message.sendSms(
    from,
    to,
    text,
    {},
    (callback = (error, response) => {
      if (error) {
        console.error(error);
        callBack(false);
      }
      if (response) {
        console.log(response);
        callBack(true);
      }
    })
  );
};
var inviteMail = (formData, user, patientLink, callback) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: config.mailCredential,
  });
  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: formData.email,
      subject: `Appointment with Dr.${user.firstName} ${user.lastName}`,
      html: `Dear Member,<br/><p>You have an appointment with Dr.${
        user.firstName
        } ${user.lastName} on ${moment()
          .tz(user.timeZone)
          .format(
            "MMM DD, YYYY, hh:mm:ss A"
          )} - ${moment().tz(user.timeZone).format('z')}. </br><a href="${patientLink}" title="Invite link">Click here to connect with Dr.${
        user.firstName
        } ${user.lastName}</a></p> 	
		 <p>Regards,<br/> 	
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

// router.post("/patientImport", function (req, res, next) {
//   console.log(req.files);
//   console.log(req.file);
//   var patientImportDatas = [];
//   async.forEachOf(
//     req.body,
//     (row, key, callback) => {
//       if (!_.isEmpty(row.patientName) && row.mobile != 0) {
//         let patient = row.patientName.split(",");
//         let firstName = !_.isEmpty(patient[1]) ? patient[1] : "";
//         let lastName = !_.isEmpty(patient[0]) ? patient[0] : "";
//         let dateOfBirth = !_.isEmpty(row.dob) ? row.dob : "";
//         let patientImport = {
//           firstName: firstName,
//           lastName: lastName,
//           fullName: firstName + " " + lastName,
//           dateOfBirth: moment(row.dob, "MM/DD/YYYY").toDate(),
//           email: "",
//           mobile: !_.isEmpty(row.mobile) ? row.mobile : "",
//           inviteType: 2,
//           providerId: req.user._id,
//           isDeleted: false,
//         };
//         patientImportDatas.push(patientImport);
//       }
//       callback();
//     },
//     (err) => {
//       if (err) console.error(err.message);
//       Patient.insertMany(patientImportDatas)
//         .then(function () {
//           res.json({
//             status: true,
//             message: "Patient Imported successfully!",
//           });
//         })
//         .catch(function (error) {
//           console.log("failer", error);
//         });
//     }
//   );
// });

router.post("/patientImport", function (req, res, next) {
  console.log(req.file);
  console.log(req.files);
  var uploadDir = config.file.uploadDir + "/patientImport";
  var form = new formidable.IncomingForm(config.file);
  var fileName = "";
  form.on("file", function (field, file) {
    console.log(file);
    fileName = file.name;
    fs.rename(file.path, uploadDir + "/" + fileName);
  });
  form.parse(req, (err, fields, files) => {
    readXlsxFile(uploadDir + "/" + fileName).then((rows) => {
      var patientImportDatas = [];
      var existEmail = [];
      var filteredRows = _.remove(rows, function (n, k) {
        return k !== 0 && n[0] !== "" && n[1] !== "" && n[2] !== "";
      });
      async.forEachOf(
        filteredRows,
        (patient, key, callback) => {
          Patient.findOne({ email: patient[2] }).exec((err, user) => {
            if (err) {
              console.log(err);
            }
            if (!_.isEmpty(user)) {
              existEmail.push(patient[2]);
            } else {
              firstName = !_.isEmpty(patient[0]) ? patient[0] : "";
              lastName = !_.isEmpty(patient[1]) ? patient[1] : "";
              let patientImport = {
                firstName: firstName,
                lastName: lastName,
                fullName: firstName + " " + lastName,
                email: patient[2],
                mobile: !_.isEmpty(patient[3]) ? patient[3] : "",
                inviteType: !_.isEmpty(patient[4]) ? patient[4] : 3,
                isDeleted: false,
              };
              patientImportDatas.push(patientImport);
            }
            callback();
          });
        },
        (err) => {
          if (err) console.error(err.message);
          Patient.insertMany(patientImportDatas)
            .then(function () {
              res.json({
                status: true,
                message: "Patient Imported successfully!",
                data: existEmail,
              });
            })
            .catch(function (error) {
              console.log("failer", error);
            });
        }
      );
    });
  });
});

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const verifyReCaptcha = () => {
  return (req, res, next) => {
    AppService.verifyReCaptcha(req, (response)=>{ 
      if(response.status){
       next()
      }else{
        res.json(response);
      } 
    })
  }
}

router.post("/registerPatient", verifyReCaptcha(), function (req, res, next) {
  if (_.isEmpty(req.body.email) && _.isEmpty(req.body.mobile)) {
    res.json({ status: false, reset:false, message: "Enter valid Email or Mobile number" });
  } else {  
    if (!_.isEmpty(req.body.email) && !_.isEmpty(req.body.mobile)) {
      var options = { email: encrypt(req.body.email), mobile: encrypt(req.body.mobile) };
      let body = Patient.find()
        .or([{ email: encrypt(req.body.email) }, { mobile: encrypt(req.body.mobile) }])
        .exec((err, patient) => {
          if (err) {
            console.log(err);
          } else {
            if (!_.isEmpty(patient)) {
              if (patient[0].isVerified) {
                res.json({
                  status: false,
                  reset:false,
                  message: "Email ID or Mobile number already exist",
                });
              } else {
                res.json({
                  status: true,
                  reset:true,
                  needVerification: true,
                  verifiedMode: patient[0].verifyMode,
                  pid: patient[0]._id,
                });
              }
            } else {
              sendVerificationLink(req.body, "both", (OTPresult) => {
                RegisterPatient(req.body, OTPresult, (result) => {
                  if (result.status) {
                    res.json(result);
                  }
                });
              });
            }
          }
        });
    } else {
      if (!_.isEmpty(req.body.email)) {
        var options = { email: encrypt(req.body.email) };
        let body = Patient.find(options).exec((err, patient) => {
          if (err) {
            console.log(err);
          } else {
            console.log("patient", patient)
            if (!_.isEmpty(patient)) {
              if (patient[0].isEmailVerified) {
                res.json({
                  status: false,
                  reset:false,
                  message: "Email ID already exists",
                });
              } else {
                res.json({
                  status: true,
                  reset:true,
                  needVerification: true,
                  verifiedMode: patient[0].verifyMode,
                  pid: patient[0]._id,
                  message: "Please verify your Email Address",
                });
              }
            } else {
              // sendRegistrationOTP(req.body, "email", (OTPresult) => {
              sendVerificationLink(req.body, "email", (OTPresult) => {
                RegisterPatient(req.body, OTPresult, (result) => {
                  if (result.status) {
                    res.json(result);
                  }
                });
              });
            }
          }
        });
      } else {
        var options = { mobile: encrypt(req.body.mobile) };
        let body = Patient.find(options).exec((err, patient) => {
          if (err) {
            console.log(err);
          } else {
            if (!_.isEmpty(patient)) {
              if (patient[0].isMobileVerified) {
                res.json({
                  status: false,
                  reset:false,
                  message: "Mobile number already exists",
                });
              } else {
                res.json({
                  status: true,
                  needVerification: true,
                  reset:true,
                  verifiedMode: patient[0].verifyMode,
                  pid: patient[0]._id,
                });
              }
            } else {
              sendVerificationLink(req.body, "mobile", (OTPresult) => {
                RegisterPatient(req.body, OTPresult, (result) => {
                  if (result.status) {
                    res.json(result);
                  }
                });
              });
            }
          }
        });
      }
    }
  }
});

router.post("/verifyToken", function (req, res, next) {

  var options = { emailOTP: req.body.token };
  Patient.find(options).exec((err, patient) => {
    if (patient[0]) {
      console.log(patient[0].isEmailVerified)
      if (!patient[0].isEmailVerified) {
        var query = { emailOTP: req.body.token };
        Patient.update(query, { isEmailVerified: true, emailOTP: "" }, function (err, data) {
          res.json({ status: true, message: "Email Verified successfully" });
        });

      } else {
        res.json({ status: false, isExpired: true });
      }
    } else {
      res.json({ status: false, message: "No Patient" });
    }
  });
});
router.post("/verifyMobile", function (req, res, next) {

  var options = { mobileOTP: req.body.token };
  Patient.find(options).exec((err, patient) => {
    if (patient[0]) {
      console.log(patient[0].isMobileVerified)
      if (!patient[0].isMobileVerified) {
        var query = { mobileOTP: req.body.token };
        Patient.update(query, { isMobileVerified: true, mobileOTP: "" }, function (err, data) {
          res.json({ status: true, message: "Mobile Verified successfully" });
        });

      } else {
        res.json({ status: false, isExpired: true });
      }
    } else {
      res.json({ status: false, message: "No Patient" });
    }
  });
});

var RegisterPatient = (formData, OTP, callBack) => {
  if (formData.email != "" && formData.mobile != "") {
    var verifiedMode = 1;


  } else {
    if (formData.email != "") {
      var verifiedMode = 2;

    } else {
      var verifiedMode = 3;

    }
  }
  console.log(OTP)
  if (!_.isUndefined(OTP.emailOTP)) {
    console.log("empty123");
  } else {
    console.log("empty");
  }
  var emailOTP = (!_.isUndefined(OTP.emailOTP)) ? OTP.emailOTP : null;
  var mobileOTP = (!_.isUndefined(OTP.mobileOTP)) ? OTP.mobileOTP : null;
  var newPatient = new Patient({
    firstName: formData.firstName,
    lastName: formData.lastName,
    fullName: formData.firstName + " " + formData.lastName,
    dateOfBirth: encrypt(moment(formData.dateOfBirth, "YYYY-MM-DD").toDate()),
    email: encrypt(formData.email),
    mobile: encrypt(formData.mobile),
    password: createHash(formData.password),
    registeredBy: 1,
    emailOTP: emailOTP,
    mobileOTP: mobileOTP,
    verifyMode: verifiedMode,
  });

  newPatient.save().then((user) => {
    //Patient verification Mode

    callBack({
      status: true,
      reset: true,
      message: "Signed up successfully! Please verify your email address.",
      verifiedMode: user.verifyMode,
      needVerification: true,
      pid: user._id,
    });
  });
};

var sendRegistrationOTP = (formData, key, callback) => {
  var OTP = Math.random().toString(36).substr(2, 6);
  console.log(OTP);
  if (key == "both") {
    var emailOTP = OTP.substr(0, 3);
    var mobileOTP = OTP.substr(3);
    sendEmailOTP(formData, emailOTP, (result) => {
      // callback(result);
    });
    sendMobileOTP(formData, mobileOTP, (result) => {
      // callback(result);
    });
    callback({ status: true, OTP: OTP });
  } else if (key == "email") {
    sendEmailOTP(formData, OTP, (result) => {
      callback({ status: true, OTP: OTP });
    });
  } else {
    console.log("Mobile only");
    sendMobileOTP(formData, OTP, (result) => {
      console.log(result);
      callback({ status: true, OTP: OTP });
    });
  }
};


var sendVerificationLink = (formData, key, callback) => {
  var OTP = Math.random().toString(36).substr(2, 6);
  console.log(OTP);
  if (key == "both") {
    var emailOTP = OTP.substr(0, 3);
    var mobileOTP = OTP.substr(3);
    sendEmailVerification(formData, emailOTP, (result) => {
      // callback(result);
    });
    sendMobileVerification(formData, mobileOTP, (result) => {
      // callback(result);
    });
    callback({ status: true, emailOTP: emailOTP, mobileOTP: mobileOTP });
  } else if (key == "email") {
    sendEmailVerification(formData, OTP, (result) => {
      callback({ status: true, emailOTP: OTP });
    });
  } else {
    console.log("Mobile only");
    sendMobileVerification(formData, OTP, (result) => {
      console.log(result);
      callback({ status: true, mobileOTP: OTP });
    });
  }
};


var sendEmailOTP = (formData, OTP, callback) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: config.mailCredential,
  });
  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: decrypt(formData.email),
      subject: `TeleScrubs Verification Code`,
      html:
        `Dear Member,<br/><p>Your OTP is ` +
        OTP +
        `</p> 	
     <p>Regards,<br/> 	
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

var sendEmailVerification = (formData, OTP, callback) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: config.mailCredential,
  });
  var emailVerifyLink = config.baseUrl + "/verify_email/" + OTP;
  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: formData.email,
      subject: `Verify your Email Address`,
      html:
        `Dear Member,<br/><p>Thank you for registering in Telescrubs.Please click the below link to verify your email address.<br> ` +
        `<a href="${emailVerifyLink}">Click here to verify</a>.
        </p> 	
     <p>Regards,<br/> 	
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

var sendMobileVerification = (formData, OTP, callBack) => {
  const from = "13048738828";
  const to = config.countryNumberCode + formData.mobile;
  console.log(to);
  var verifyLink = config.baseUrl + "/verify_mobile/" + OTP;
  const text = `Dear Member,\nThank you for registering in Telescrubs.Please click the below link to verify your mobile number. \n Click here to verify ${verifyLink}`;
  nexmo.message.sendSms(
    from,
    to,
    text,
    {},
    (callback = (error, response) => {
      if (error) {
        console.error(error);
        callBack(false);
      }
      if (response) {
        console.log(response);
        callBack(true);
      }
    })
  );
};

router.post("/verifyOTP", function (req, res, next) {
  var options = { emailOTP: req.body.otp, _id: req.body.pid };
  console.log(options);
  Patient.find(options).exec((err, data) => {
    if (!_.isEmpty(data)) {
      console.log(data);
      var query = { _id: req.body.pid };
      Patient.update(query, { isVerified: true }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            status: true,
            message: "Account verified successfully",
            isVerified: true,
            pid: req.body.pid,
          });
        }
      });
    } else {
      res.json({
        status: false,
        message: "Enter valid OTP",
      });
    }
  });
});

router.post("/saveIntakeForm", requirePatientAuth, function (req, res, next) {
  var uploadDir = config.file.uploadDir + "/IntakePic";
  var form = new formidable.IncomingForm(config.file);
  var fileName = "";
  body = {};
  uploadedImages = [];
  var test;
  form.on("file", function (field, file) {
    if (!_.isEmpty(file)) {
      var imageName = moment().format("x") + "_" + file.name;
      fs.rename(file.path, uploadDir + "/" + imageName, function (err) {
        if (err) throw err;
        console.log('renamed complete');
      });
      uploadedImages.push(imageName);
    }
  });

  form.on("field", function (field, value) {
    body[field] = value;
    if (field == "deletedFiles" && !_.isEmpty(value)) {
      value.split(",").forEach((file) => {
        // fs.unlink(uploadDir + "/" + file);
      });
    }
    if (field == "images" && !_.isEmpty(value)) {
      value.split(",").forEach((file) => {
        uploadedImages.push(file);
      });
    }
  });

  form.parse(req, (err, fields, files) => {
    var query = { patientId: req.user._id };
    if (!_.isEmpty(uploadedImages)) {
      body.images = uploadedImages;
    } else {
      body.images = [];
    }
    console.log(body)
    IntakeForm.findOneAndUpdate(query, body, { upsert: true }, function (
      err,
      doc
    ) {
      if (err) {
        console.log(err);
      } else {
        console.log({ _id: body.appointmentId })
        if (!_.isEmpty(body.appointmentId)) {
          AppointmentService.getAppointment({ _id: body.appointmentId }, (result) => {

            if (result.status) {
              res.json({
                status: true,
                message: "Intake form saved successfully",
                data: body,
                authToken: result.data.authToken
              });
            } else {
              res.json({
                status: true,
                message: "Intake form saved successfully",
                data: body,
              });
            }
          });
        } else {
          res.json({
            status: true,
            message: "Intake form saved successfully",
            data: body,
          });

        }
        req.body.message = `Intake form saved success`;
        AppService.auditLog(req, "M2: Intake Form"); 
      }
    });
  });
});

router.get("/getPatientIntakeForm/:id/:appointmentId", AppService.authGuard, function (
  req,
  res,
  next
) {
  Patient.aggregate([{
    $lookup: {
      from: 'intake_forms',
      localField: '_id',
      foreignField: 'patientId',
      as: 'intakeForm'
    }
  },
  {
    $lookup: {
      from: "patient_visit_foms",
      localField: "_id",
      foreignField: "patientId",
      as: "visitForm",
    },

  },
  {
    $match: { _id: mongoose.Types.ObjectId(req.params.id) },
  }])
    .exec(function (err, result) {
      if (err) { AppService.errorHandling(err, req, res); }
      else {
        result.forEach((appoint) => {
          appoint.visitForm = listDecryption(appoint.visitForm, ["visitFormData"]);
          appoint.dateOfBirth = decrypt(appoint.dateOfBirth);
        })
        console.log("Intake ", result)

        AppointmentService.getAppointment({ _id: mongoose.Types.ObjectId(req.params.appointmentId) }, (appResult) => {
          // console.log(appResult)
          if(!_.isEmpty(result)){ 
            result[0].authToken = appResult.data.authToken;
          }

          AppService.sendResponse(res, true, "Patient Intake From Successfully!", result);
        });

      }
    });
});

router.post("/getIntakeFormData", requirePatientAuth, function (
  req,
  res,
  next
) {
  var query = { patientId: req.user._id };
  IntakeForm.findOne(query)
    .lean()
    .exec(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        if (!_.isEmpty(data)) {
          let user = req.user.toJSON({ versionKey: false });
          data["defaultPharmacy"] = user.pharmacy;
        }
        res.json({
          status: true,
          data: data,
        });
      }
    });
});

router.post("/setPassword", function (req, res, next) {
  var id = req.body.pid;
  var password = req.body.password;
  var retypePassword = req.body.retypePassword;
  if (password != retypePassword) {
    res.json({
      message: "Password and Retype password must be same",
      status: false,
    });
    return false;
  }
  Patient.findOne({
    _id: id,
  }).exec((err, patient) => {
    if (err) {
      console.log(err);
    }
    if (patient) {
      console.log(patient);
      var updateUser = {
        $set: {
          password: createHash(password),
        },
      };
      Patient.findByIdAndUpdate(
        patient._id,
        updateUser,
        { new: true },
        function (err, updatedUser) {
          if (err) {
            res.json({ status: false, message: "Password reset failed!" });
          } else {
            res.json({
              status: true,
              message: "Password set successfully!Please login",
            });
          }
        }
      );
    } else {
      res.json({
        message: "Invalid Link",
        status: false,
      });
    }
  });
});

router.post("/visitForm/:patientId", AppService.authGuard, function (req, res, next) { 
  Appointment.find({authToken: req.body.appointmentId}, (err, appoint)=>{ 
    if(!_.isEmpty(appoint)){
      req.body.appointmentId = appoint[0]._id;
      visitFormValidation(req.body, (isValid, errors) => {
        if (isValid) {
          req.body.dos = moment().toDate(); 
          var visitFormData = new PatientVisitForm({
            appointmentId: req.body.appointmentId,
            patientId: req.params.patientId,
            visitFormData: encrypt(req.body)
          });
          PatientVisitForm.findByIdAndUpdate(req.body.appointmentId,
            {
              appointmentId: req.body.appointmentId,
              patientId: req.params.patientId,
              visitFormData: encrypt(req.body)
    
            },
            { upsert: true }, (err, visit) => {
              if (err) {
                AppService.errorHandling(err, req, res);
              } else {
                AppService.sendResponse(res, true, "New Visit Form Saved successsfully!");
              }
            })
        } else {
          AppService.sendResponse(res, isValid, errors);
        }
      }) 
    }else{
      AppService.sendResponse(res, false, "Invalid Video token!");
    } 
  })   
  
});

router.post("/getPatientDocuments", AppService.authGuard, function (req, res, next) {
  let match = {  doctorId: AppService.session(req).userId };
  let skip =(req.body.perPage * (req.body.page-1))
  let sort = {createdAt: -1}
  if(req.body.sortable){
    let sortDirection = (req.body.sortable.sort == "asc")? 1 : -1;
    sort = { [req.body.sortable.selector] : sortDirection }
  }
  if(req.body.dateFilter.length){ 
    match.date = { $gte: moment(req.body.dateFilter[0]).toDate(), $lte: moment(req.body.dateFilter[1]).toDate() };
  } 
  if(req.body.search.length){ 
    match['$or'] = [ 
      { 'patient.firstName': { $regex : new RegExp(req.body.search, 'i') } },
      { 'patient.lastName': { $regex : new RegExp(req.body.search, 'i') } }
    ]
  } 
  console.log(match)

  async.parallel([
    function (callback) {
      Appointment.aggregate([
        {
          $lookup: {
            'from': 'patients',
            'localField': 'patientId',
            'foreignField': '_id',
            'as': 'patient'
          }
        }, 
        { $unwind: "$patient" }, 
        {
          $lookup: {
            'from': 'appointment_payments',
            'localField': '_id',
            'foreignField': 'appointment_id',
            'as': 'payment'
          }
        },
        {
          $lookup: {
            'from': 'intake_forms',
            'localField': 'patientId',
            'foreignField': 'patientId',
            'as': 'intakeForm'
          }
        },
        {
          $lookup: {
            'from': 'patient_visit_foms',
            'localField': '_id',
            'foreignField': 'appointmentId',
            'as': 'visitForm'
          }
        }, 
        {
          $addFields: {
            'date': {
              $toDate: '$datetime'
            }
          }
        },  
        {
          $match: match,
        }, 
        { $sort :  sort }, 
        { $skip :  skip },  
        { $limit: req.body.perPage },  
        {
          $project: {
            "_id": 1,
            "patientId": 1, 
            "patient.firstName": 1, 
            "patient.lastName": 1, 
            "patient.mobile": 1,
            "patient.email": 1,
            "patient.pharmacy":1, 
            "patient.dateOfBirth":1,
            "createdByDoctor":1,
            "payment":1,
            "intakeForm":1,
            "visitForm":1,
            "status":1,
            "date": 1,
          }
        } 
      ], callback);
    },
    function (callback) {
      Appointment.aggregate([
        {
          $lookup: {
            'from': 'patients',
            'localField': 'patientId',
            'foreignField': '_id',
            'as': 'patient'
          }
        }, 
        {
          $match: match,
        },  
        {
          $count: 'recordCount'
        } 
      ]).exec(callback);
    }
  ], (err, results) => {
    if (err) {
      AppService.errorHandling(err, req, res);
    } else { 
      _.forEach(results[0], (appoint, key) => {
        dataDecrypt(appoint.patient, { in: patientVirtual.encryptFields })
        // appoint.visitForm.forEach((visit) => { 
          appoint.visitForm = listDecryption(appoint.visitForm, ["visitFormData"]); 
        // })
      });
      let result = {
        list: results[0],
        total: !_.isEmpty(results[1][0])? results[1][0].recordCount : 0 
      }
      AppService.sendResponse(res, true, "Patient Documents List", result);
    } 
  });
   
});

router.get("/pdfViewer/:folder/:file", function (req, res, next) {
  var file = fs.createReadStream(`${config.file.uploadDir}/${req.params.folder}/${req.params.file}`);
  var stat = fs.statSync(`${config.file.uploadDir}/${req.params.folder}/${req.params.file}`);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  file.pipe(res);
});

router.get("/icdCodes", AppService.authGuard, function (req, res, next) {
  ICD.find({}, (err, codes) => {
    if (err) {
      AppService.errorHandling(err, req, res);
    } else {
      AppService.sendResponse(res, true, "Patient Data Saved Successfully!", codes);
    }
  })
});

router.get("/enc_patient_data/", function (req, res, next) {
  var str = req.params.text;
  var patient_data = Patient.find({}, function (error, response) {
    var count = 0;
    response.forEach((value, key) => {
      var email = encrypt(value.email);
      var mobile = encrypt(value.mobile);
      var dateOfBirth = encrypt(value.dateOfBirth);
      Patient.findByIdAndUpdate(value._id, { email: email, mobile: mobile, dateOfBirth: dateOfBirth }, function (err, re) {
        if (err) {
          // res.json({ err });
          console.log(err)
        } else {
          console.log(count++);
          // res.json({ status: "Updated!" });
        }
      })
    })
  });
});

router.get("/enc/:text", function (req, res, next) {
  var str = req.params.text;
  if (str) {
    res.json({ "encrypt_str": encrypt(str) })
  }
});

router.get("/dec/:text", function (req, res, next) {
  var str = req.params.text.replace("INR", "/");
  if (str) {
    res.json({ "decrypt_str": decrypt(str) })
  }
});


module.exports = router;
 
