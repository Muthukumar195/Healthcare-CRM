const express = require("express");
const router = express.Router();
const Nexmo = require("nexmo");
const nodemailer = require("nodemailer");
const Patient = require("../models/Patient.js");
var config = require("../configs/config");
const nexmo = new Nexmo(config.nexmo);
var moment = require("moment-timezone");

router.get("/dashboard", function (req, res, next) {
  res.json("Welcome to VELAN MERN Admin");
});

router.get("/getPatient", function (req, res, next) {
  Patient.find({ isDeleted: false }).exec((err, patients) => {
    if (err) {
      console.log(err);
    }
    if (patients) {
      res.json({
        status: true,
        message: "Patient List",
        data: patients,
      });
    }
  });
});

router.post("/sendInvite", function (req, res, next) {
  let formData = req.body.formData;
  if (formData.inviteOption == 1) {
    inviteMail(req.body.formData, (result) => {
      if (result) {
        res.json({
          status: true,
          message: "Email sent successfully !",
          inviteLink: config.inviteLink,
        });
      } else {
        res.json({ status: false, message: "Email send failed!" });
      }
    });
  } else if (formData.inviteOption == 2) {
    inviteSMS(req.body.formData, (result) => {
      if (result) {
        res.json({
          status: true,
          message: "Text message sent successfully!",
          inviteLink: config.inviteLink,
        });
      } else {
        res.json({ status: false, message: "Text message send failed!" });
      }
    });
  } else if (formData.inviteOption == 3) {
    Patient.find({ _id: req.body.formData.patientId }).exec((err, patients) => {
      if (err) {
        console.log(err);
      }
      if (patients) {
        let patient = patients[0];
        if (patient.inviteType == 1 || patient.inviteType == 3) {
          inviteMail(patient, (result) => {
            if (result) {
              if (patient.inviteType == 3) {
                res.json({
                  status: true,
                  message: "Email and Text mesasge sent successfully!",
                  inviteLink: config.inviteLink,
                });
              } else {
                res.json({
                  status: true,
                  message: "Email sent successfully!",
                  inviteLink: config.inviteLink,
                });
              }
            } else {
              res.json({ status: false, message: "Email send failed!" });
            }
          });
        }
        if (patient.inviteType == 2 || patient.inviteType == 3) {
          inviteSMS(patient, (result) => {
            if (patient.inviteType == 2) {
              if (result) {
                res.json({
                  status: true,
                  message: "SMS sent successfully !",
                  inviteLink: config.inviteLink,
                });
              } else {
                res.json({ status: false, message: "SMS send failed!" });
              }
            }
          });
        }
      }
    });
  }
});

var inviteSMS = (formData, callBack) => {
  const from = "TeleScrubs";
  const to = config.countryNumberCode + formData.mobile;
  console.log(to);
  const text =
    "Please click the " + config.inviteLink + " to join the session.";
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

var inviteMail = (formData, callback) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: config.mailCredential,
  });
  transporter.sendMail(
    {
      from: '"Team TeleScrubs" vispl.framework@gmail.com',
      to: formData.email,
      subject: "Appointment with Dr.David Clark",
      html: `<b>Dear Member,</b><br/>
		 <p>You have an appointment with Dr. David Clark on ${moment()
       .tz("America/New_York")
       .format("MMM DD, YYYY, hh:mm:ss A")}. </br><a href="${
        config.inviteLink
      }" title="Invite link">Click here to connect with Dr. David Clark</a></p>
	  <br/>
		 <p>Regards,</p>
		 <p>TeleScrubs Team</p>`,      
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

module.exports = router;
