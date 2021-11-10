var express = require("express");
var router = express.Router();
const Video = require("../models/Video.js");
const async = require("async");
var User = require("../models/User.js");
const Patient = require("../models/Patient.js");
var preferences = require("../models/Users.js");
const Appointment = require("../models/AppointmentModel.js");
const VideoSessionLogs = require("../models/VideoSessionLogsModel");
const { videoSessionLog } = require("../services/AppService.js");
const AppService = require("../services/AppService.js");
var { listDecryption, dataDecrypt } = require("../services/CryptoService");
const AppointmentService = require("../services/AppointmentService.js");
const { callDisconnectMail } = require("../services/MailService");
const _ = require("lodash");
var config = require("../configs/config");
const moment = require("moment");
const AppointmentPayment = require("../models/AppointmentPayment.js");
const stripe = require("stripe")(
  "sk_test_51HEoMTAWkhcS9lGW6CrDoBDJhvWsvBlSH5yifK2sWXrzley4LnOrqHrIV6ptCtTQorg8OoPPfDeaHFXn7B710pid00Zx4vesZD"
);
var patientVirtual = new Patient();

module.exports = router;

var OpenTok = require("../lib/opentok");
var opentok;
var apiKey = "46761672";
var apiSecret = "76399a43b069914d98adcdc1a76fac5540497fd0";
var onlinePatients = [];

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log("You must specify API_KEY and API_SECRET environment variables");
  process.exit(1);
}

router.post("/sessionDisconnect", function (req, res, next) {
  var searchData = {
    sessionId: req.body.sessionId,
  };
  Video.update(searchData, { linkStatus: 2 }, { multi: true }).exec(
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: true,
          message: "sessionDisconnect",
          key: "disconnect",
        });
      }
    }
  );
});

router.post("/disconnectAppointmentSession", async function (req, res, next) {
  var appointmentDetails = {};
  AppointmentService.getAppointmentDetails({ authToken: req.body.authToken }, async (appoint) => {
    appointmentDetails = appoint;
  });
  AppointmentService.getAppointment({ authToken: req.body.authToken }, async (appointment) => {
    req.body.appointmentId = appointment.data._id;
    getAppointmentPayment(req.body, async (result) => {
      try {
        const paymentIntent = await stripe.paymentIntents.capture(
          result.data.payment_intent_id,
          {
            amount_to_capture: result.data.amount,
          }
        );
        req.body.status = "Completed";
        setAppointmentWaitingStatus(req.body, (data) => {
          callDisconnectMail(appointmentDetails.data, (mail) => {
            res.json({
              status: true,
              message: "sessionDisconnect",
              key: "disconnect",
            });
          })

        });

      } catch (err) {
        req.body.status = "Completed";
        setAppointmentWaitingStatus(req.body, (data) => {
          callDisconnectMail(appointmentDetails.data, (mail) => {
            res.json({
              status: true,
              message: "sessionDisconnect",
              key: "disconnect",
            });
          });
        });
        // res.json({
        //   status: false,
        //   error: err,
        //   key: "disconnect",
        // });
      }
    })

  });
});

var getAppointmentPayment = (formData, callBack) => {
  AppointmentPayment.findOne({
    appointment_id: formData.appointmentId,
  }).exec((err, data) => {
    if (err) {
      callBack({
        status: false,
      });
    } else {
      callBack({
        status: true,
        data,
      });
    }

  });

};

router.post("/getAppointmentToken", function (req, res, next) {
  getAppointmentSessionId(req.body, (data) => {
    if (data.status) {
      console.log("AAP SESS", data.data)
      req.body.appointmentId = data.data._id;
      validateAppointmentToken(data.data, (result) => {

        if (result.status) {
          console.log("session", result.data.sessionId);
          var sessionId = result.data.sessionId;
          req.body.sessionId = sessionId;
          var tokenOptions = {};
          tokenOptions.role = "moderator";
          tokenOptions.data = "username=Doctor";
          // console.log(config.opentokApiKey);
          // console.log(config.opentokApiSecret);
          var AppointmentOpentok = new OpenTok(
            config.opentokApiKey,
            config.opentokApiSecret
          );
          // // generate a fresh token for this client
          var token = AppointmentOpentok.generateToken(sessionId, tokenOptions);

          var doctorName =
            "Dr. " +
            result.data.users[0].firstName +
            " " +
            result.data.users[0].lastName;
          var patientName = !result.data.patients[0]
            ? null
            : result.data.patients[0].firstName +
            " " +
            result.data.patients[0].lastName;

          var preferences = result.data.preferences[0];
          setAppointmentWaitingStatus(req.body, (data) => {
            if (data.status) {
              res.json({
                status: true,
                message: "success",
                data: {
                  sessionId: sessionId,
                  token: token,
                  doctorName: doctorName,
                  patientName: patientName,
                  preferences: preferences,
                },
              });
            } else {
              res.json({
                status: true,
                message: "There is some problem on updatinig the appointment status.Please contact Administrator"
              })
            }
          })


        }
      });
    } else {
      res.json({
        status: false,
        message: "Something went wrong!Please check the Appointment ID",
      });
    }
  });
});


var setAppointmentWaitingStatus = (formData, callback) => {

  if (formData.status != null) {
    Appointment.findByIdAndUpdate(formData.appointmentId, {
      $set: { "status": formData.status },
    }).then((err, result) => {

      // videoSessionLog(formData)
      callback({ status: true });
    })
  } else {
    if (!formData.isDoctor) {
      Appointment.findByIdAndUpdate(formData.appointmentId, {
        $set: { "status": "Waiting" },
      }).then((err, result) => {
        formData.status = "Waiting";
        // videoSessionLog(formData)
        callback({ status: true });
      })
    } else {
      Appointment.findByIdAndUpdate(formData.appointmentId, {
        $set: { "status": "Connected" },
      }).then((err, result) => {
        formData.status = "Connected";
        // videoSessionLog(formData)
        callback({ status: true });
      })

    }

  }


};



var getAppointmentSessionId = (formData, callBack) => {
  var authToken = formData.authToken;
  console.log("aapId", formData.authToken);
  Appointment.findOne({
    authToken: authToken,
  }).exec((err, data) => {
    if (err) {
      callBack({
        status: false,
      });
    } else {
      console.log(data);
      if (data != null) {
        callBack({
          status: true,
          data,
        });
      } else {
        callBack({
          status: false,
        });
      }

    }
  });
};

router.post("/getToken", validateLink, function (req, res, next) {
  validateToken(req.body, (result) => {
    console.log(result);
    if (result.status) {
      var sessionId = result.data.sessionId;
      var tokenOptions = {};
      tokenOptions.role = "moderator";
      tokenOptions.data = "username=Doctor";
      opentok = new OpenTok(apiKey, apiSecret);
      // generate a fresh token for this client
      var token = opentok.generateToken(sessionId, tokenOptions);
      var doctorName =
        "Dr. " +
        result.data.users[0].firstName +
        " " +
        result.data.users[0].lastName;
      var patientName = !result.data.patient[0]
        ? null
        : result.data.patient[0].firstName +
        " " +
        result.data.patient[0].lastName;
      var preferences = result.data.preferences[0];
      console.log(result);
      res.json({
        status: true,
        message: "success",
        data: {
          sessionId: sessionId,
          token: token,
          doctorName: doctorName,
          patientName: patientName,
          preferences: preferences,
        },
      });
    }
  });
});

function validateLink(req, res, next) {
  Video.findOne({
    _id: req.body.sessionId,
  }).exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data != null) {
        if (data.linkStatus == 1) {
          next();
        } else {
          res.json({
            status: false,
            message: "Link Expired",
          });
        }
      } else {
        res.json({
          status: false,
          message: "Link Expired",
        });
      }
    }
  });
}

var validateAppointmentToken = (formData, callBack) => {
  var sessionResult = {};
  var resources = {};
  var mongoose = require("mongoose");
  console.log("session ID--", formData.sessionId);
  if (_.isEmpty(formData)) {
    callBack({ status: false, message: "No data found" })
  } else {
    Appointment.aggregate(
      [
        {
          $lookup: {
            from: "users",
            localField: "doctorId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "preferences",
            localField: "doctorId",
            foreignField: "providerId",
            as: "preferences",
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "patientId",
            foreignField: "_id",
            as: "patients",
          },
        },
        {
          $match: {
            sessionId: formData.sessionId,
          },
        },
      ],
      function (error, data) {
        if (error) {
          callBack({ status: false, message: "No data found" });
        } else {
          console.log(data)
          callBack({ status: true, data: data[0] });
        }

        //handle error case also
      }
    );
  }
};

var validateToken = (formData, callBack) => {
  console.log(formData.sessionId);
  var sessionResult = {};
  var resources = {};
  var mongoose = require("mongoose");

  Video.aggregate(
    [
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "providerId",
          foreignField: "providerId",
          as: "preferences",
        },
      },

      {
        $addFields: {
          patient_id: {
            $toObjectId: "$patientId",
          },
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(formData.sessionId),
        },
      },
    ],
    function (error, data) {
      callBack({ status: true, data: data[0] });
      //handle error case also
    }
  );
};

router.post("/waitingRoom", function (req, res, next) {
  var Pusher = require("pusher");

  var pusher = new Pusher({
    appId: "1057335",
    key: "3f4734a3916dccab4677",
    secret: "78e27cfbf756f5b0cdc6",
    cluster: "ap2",
    encrypted: true,
  });

  // var onlinePatientsData = getPatientData(onlinePatients, req.body);

  // onlinePatients.push({ id: req.body.sessionId, data: req.body });
  // onlinePatients[req.body.sessionId] = req.body;

  pusher.trigger("video-session-room", "my-event", {
    data: req.body,
  });
  res.json({
    status: true,
    message: "waiting room success",
  });
});

router.post("/logVideoSession", AppService.authGuard, function (req, res, next) {
  req.body.userId = AppService.session(req).userId;
  //videoSessionLog(req.body); 
   AppService.auditLog(req, "M1: VS");
  res.json({
    status: true,
    data: req.body,
  });
});

router.post("/logunAuthVideoSession", function (req, res, next) {
  req.body.userId = null;
  //videoSessionLog(req.body);
  AppService.auditLog(req, "M1: VS");
  res.json({
    status: true,
    data: req.body,
  });
});

router.post("/getVideoSessionLogs", AppService.authGuard, function (req, res, next) {
  let match = {} ;
  //let match = {"appointments.doctorId" : AppService.session(req).userId};
  match['$or'] = [
    {"appointments.doctorId" : AppService.session(req).userId},
    {"videos.providerId" : AppService.session(req).userId}  
  ]
  let skip = (req.body.perPage * (req.body.page - 1))
  let sort = { createdAt: -1 }
  if (req.body.sortable) {
    let sortDirection = (req.body.sortable.sort == "asc") ? 1 : -1;
    sort = { [req.body.sortable.selector]: sortDirection }
  }
  if (req.body.dateFilter.length) {
    var endDate = moment(req.body.dateFilter[1]).toDate();
    if (moment(req.body.dateFilter[1]).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
      endDate = moment().endOf('day').toDate()
    }
    match.createdAt = { $gte: moment(req.body.dateFilter[0]).toDate(), $lte: endDate };
  }
  if (req.body.search.length) {
    match['$or'] = [
      { 'patient.firstName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'patient.lastName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'doctor.firstName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'doctor.lastName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'createdAt': { $regex: new RegExp(req.body.search, 'i') } },
      { 'sessionId': { $regex: new RegExp(req.body.search, 'i') } },
      { 'browser': { $regex: new RegExp(req.body.search, 'i') } },
      { 'OS': { $regex: new RegExp(req.body.search, 'i') } }
    ]
  }
  console.log(match)

  async.parallel([
    function (callback) {
      VideoSessionLogs.aggregate([
        {
          '$addFields': {
            'user_id': {
              '$toObjectId': '$userId'
            }
          }
        }, 
        {
          '$addFields': {
            'session_id': {
              '$toObjectId': '$sessionId'
            }
          }
        },{
          '$lookup': {
            'from': 'videos',
            'localField': 'session_id',
            'foreignField': '_id',
            'as': 'videos'
          }
        },{
          '$lookup': {
            'from': 'appointments',
            'localField': 'session_id',
            'foreignField': '_id',
            'as': 'appointments'
          }
        },{
          '$lookup': {
            'from': 'users',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'doctor'
          }
        }, {
          '$lookup': {
            'from': 'patients',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'patient'
          }
        },
        { $match: match },
        { $sort: sort },
        { $skip: skip },
        { $limit: req.body.perPage }
      ], callback);
    },
    function (callback) {
      VideoSessionLogs.aggregate([
        { $match: match },
        { $count: 'recordCount' }
      ]).exec(callback);
    }
  ], (err, results) => {
    if (err) {
      AppService.errorHandling(err, req, res);
    } else {
      let result = {
        list: results[0],
        total: !_.isEmpty(results[1][0]) ? results[1][0].recordCount : 0
      }
      AppService.sendResponse(res, true, "Video Session Logs List", result);
    }
  });

});

function getPatientData(patientsData, post_data) {
  const { length } = patientsData;
  const id = length + 1;
  const found = patientsData.some((el) => el.id === post_data.id);
  if (!found) patientsData.push({ id: post_data.id, data: post_data });
  return patientsData;
}

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


