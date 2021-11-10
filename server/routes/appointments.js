const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Appointment = require("../models/AppointmentModel.js");
const Availability = require("../models/AvailabilityModel.js");
const virtual = new Appointment();
const AppService = require("../services/AppService.js");
const { cancleAppointmentMail } = require("../services/MailService");
const AppointmentService = require("../services/AppointmentService.js");
var { listDecryption, decrypt, encrypt } = require("../services/CryptoService.js");
const PatientVisitForm = require("../models/PatientVisitFormModel.js");
var patientVisitVirtual = new PatientVisitForm();
const _ = require("lodash");
const async = require("async");
const moment = require("moment-timezone");
var config = require("../configs/config");
var User = require("../models/User.js");
//moment.tz.setDefault(config.timeZone);
router.post("/addAppointment", AppService.authGuard, (req, res, next) => {
  req.body.doctorId = AppService.session(req).userId;
  Appointment.aggregate([{
    '$addFields': {
      'date': {
        '$toDate': '$datetime'
      }
    }
  }, {
    '$addFields': {
      'day': {
        '$dayOfMonth': '$date'
      },
      'month': {
        '$month': '$date'
      }
    }
  }, {
    $match: {
      doctorId: AppService.session(req).userId,
      day: { $eq: moment(req.body.datetime).date() },
      month: {
        $eq: (moment(req.body.datetime).month() + 1),
      }
    },
  }], (err, result) => {
    if (err) { AppService.errorHandling(err, req, res); }
    if (!AppointmentService.timeSlotCheck(result, req.body)) {
      AppService.sendResponse(res, false, "Appointment already scheduled at this time!");
    } else {
      if (req.body.appointmentId) {

        AppointmentService.hasSkipPayment(req.body.doctorId, (result) => {
          if (result.status) {
            req.body.authToken = req.body.appointmentId;
          } else {
            req.body.authToken = "";
          }

          Appointment.findByIdAndUpdate(req.body.appointmentId,
            { $set: req.body }, { new: true }, (err, result) => {
              AppointmentService.sendNotification(result, true, (result) => {
                req.body.message = "Reschedule Appointment Success";
                AppService.auditLog(req, "M2 Appointment")
                AppService.sendResponse(res, true, "Appointment Updated Successfully!");
              })
            });

        });

      } else {

        createSession(req.body, (result) => {

          if (result.status) {


            req.body.sessionId = result.sessionId;


            Appointment.create(req.body, (err, appointment) => {
              if (err) {
                AppService.errorHandling(err, req, res);
              } else {
                AppointmentService.hasSkipPayment(req.body.doctorId, (result) => {
                  if (result.status) {
                    var update_params = { authToken: appointment._id };
                  } else {
                    var update_params = { authToken: "" };
                  }

                  Appointment.findByIdAndUpdate(appointment._id,
                    { $set: update_params }, (err, result) => {
                      AppointmentService.sendNotification(appointment, false, (result) => {
                        req.body.message = "Add Appointment Success";
                        AppService.auditLog(req, "M2 Appointment")
                        AppService.sendResponse(res, true, "Appointment Added Successfully!");
                      })
                    });

                });

              }
            });



          }
        });
      }
    }

  });
});
router.post("/addPatientAppointment", AppService.authGuard, (req, res, next) => {
  req.body.patientId = AppService.session(req).userId;
  req.body.createdByDoctor = false;
  var reqDoctorId = req.body.doctorId;
  //req.body.datetime = `${moment(req.body.date).format('YYYY-MM-DD')} ${moment(req.body.time, ["hh:mm A"]).format("HH:mm")}`;
  AppointmentService.timeSlotCheckForPatient('patient', req.body.patientId, req, (slot) => {
    if (!slot) {
      AppService.sendResponse(res, false, "Appointment already scheduled at this time!");
    } else {
      getAvailableDoctor(req.body, (doctors) => {
        console.log("dasdasd", doctors)
        if (doctors) {
          var isAvailable = false;
          async.forEachOf(doctors, (value, key, callback) => {
            AppointmentService.timeSlotCheckForPatient('doctor', value, req, (slot) => {
              if (slot && !isAvailable) {
                req.body.doctorId = value
                isAvailable = true
              }
              callback();
            })
          }, err => {
            if (err) console.log(err.message);
            if (isAvailable) {
              if (req.body.appointmentId) {
                AppointmentService.timeSlotCheckForPatient('doctor', req.body.doctorId, req, (slot) => {
                  if (slot) {
                    req.body.doctorId = reqDoctorId;
                  }
                  Appointment.findByIdAndUpdate(req.body.appointmentId,
                    { $set: req.body }, { new: true }, (err, result) => {
                      Availability.findOneAndUpdate({ doctorId: req.body.doctorId },
                        { $set: { lastActivity: moment().toDate() } }, (err, result) => {
                          // AppService.sendResponse(res, true, "Appointment Updated Successfully!");
                          AppointmentService.hasSkipPayment(req.body.doctorId, (result) => {
                            if (result.status) {
                              var update_params = { authToken: req.body.appointmentId };
                            } else {
                              var update_params = { authToken: "" };
                            }

                            Appointment.findByIdAndUpdate(req.body.appointmentId,
                              { $set: update_params }, (err, result) => {
                                AppointmentService.sendNotification(result, false, (result) => {
                                  req.body.message = "Reschedule Appointment Success";
                                  AppService.auditLog(req, "M2 Appointment")
                                  AppService.sendResponse(res, true, "Appointment updated Successfully!");
                                })
                              });

                          });
                        });
                    });
                })

              } else {

                createSession(req.body, (result) => {

                  if (result.status) {


                    req.body.sessionId = result.sessionId;
                    Appointment.create(req.body, (err, appointment) => {
                      if (err) {
                        AppService.errorHandling(err, req, res);
                      } else {
                        Availability.findOneAndUpdate({ doctorId: req.body.doctorId },
                          { $set: { lastActivity: moment().toDate() } }, (err, result) => {
                            AppointmentService.hasSkipPayment(req.body.doctorId, (result) => {
                              if (result.status) {
                                var update_params = { authToken: appointment._id };
                              } else {
                                var update_params = { authToken: "" };
                              }

                              Appointment.findByIdAndUpdate(appointment._id,
                                { $set: update_params }, (err, result) => {
                                  AppointmentService.sendUrgentCareNotification(appointment, false, (result) => {
                                    req.body.message = "Add Appointment Success";
                                    AppService.auditLog(req, "M2 Appointment")
                                    AppService.sendResponse(res, true, "Appointment Added Successfully!");
                                  })
                                });

                            });
                            // AppointmentService.sendUrgentCareNotification(appointment, false, (result) => {
                            //   AppService.sendResponse(res, true, "Appointment Added Successfully!");
                            // });

                          });
                      }
                    });
                  }
                })
              }
            } else {
              AppService.sendResponse(res, false, "No Doctors Available!");
            }
          });
        } else {
          AppService.sendResponse(res, false, "No Doctors Available!");
        }
      });
    }
  });
});

var createSession = (formData, callBack) => {
  var OpenTok = require("../lib/opentok");
  var apiKey = config.opentokApiKey;
  var apiSecret = config.opentokApiSecret;
  opentok = new OpenTok(apiKey, apiSecret);
  opentok.createSession(function (err, session) {
    var sessionID = 0;
    var sessionStatus = false;
    if (!_.isEmpty(session)) {
      if (!_.isEmpty(session.sessionId)) {
        sessionID = session.sessionId;
        sessionStatus = true;
      } else {

        sessionID = null;
        sessionStatus = false;
      }
    } else {
      sessionID = null;
      sessionStatus = false;
    }

    callBack({ status: sessionStatus, sessionId: sessionID });
    if (err) throw err;
  });
};

var getAvailableDoctor = (requested, callBack) => {
  var day = moment(requested.date).format('dddd');
  Availability.aggregate([{
    '$addFields': {
      'fromDates': `$availablity.${day}.timeSlot.from`,
      'toDates': `$availablity.${day}.timeSlot.to`,
      'dayOff': `$availablity.${day}.dayOff`,
    },
  },
  {
    $match: {
      'dayOff': false,
    },
  }, { $sort: { lastActivity: 1 } }], (err, result) => {
    if (err) { AppService.errorHandling(err, req, res); }
    else { callBack(AppointmentService.availableDoctorsList(result, requested)) }

  });
}


router.post("/cancelAppointment", AppService.authGuard, (req, res, next) => {
  Appointment.findByIdAndRemove(req.body.id).then((result) => {
    AppService.auditLog(req, "Cancel  Appointment")
    AppService.sendResponse(res, true, "Appointment Cancelled!");
  })
})

router.post("/cancleUrgentCareAppointments", AppService.authGuard, (req, res, next) => {
  Appointment.aggregate([
    {
      '$lookup': {
        'from': 'patients',
        'localField': 'patientId',
        'foreignField': '_id',
        'as': 'patient'
      }
    },
    {
      '$lookup': {
        'from': 'users',
        'localField': 'doctorId',
        'foreignField': '_id',
        'as': 'doctor'
      }
    },
    {
      '$addFields': {
        'date': {
          '$toDate': '$datetime'
        }
      }
    },
    {
      $match: {
        doctorId: AppService.session(req).userId,
        createdByDoctor: false,
        status: "Scheduled"
      },
    }
  ], (err, result) => {
    async.forEachOf(
      result,
      (appointment, key, callback) => {
        cancleAppointmentMail(appointment, (mail) => {
          Appointment.findByIdAndRemove(appointment._id).then((result) => {
            callback()
          })
        })

      },
      (err) => {
        if (err) console.error(err.message);
        AppService.sendResponse(res, true, "Appointment Cancelled!");
      }
    );
  });
})



router.post("/getAppointments", AppService.authGuard, function (req, res, next) {
  var dayFilter = { $gte: moment(req.body.startOf).toDate(), $lte: moment(req.body.endOf).toDate() }
  async.parallel([
    function (callback) {
      Appointment.aggregate([
        {
          '$lookup': {
            'from': 'patients',
            'localField': 'patientId',
            'foreignField': '_id',
            'as': 'patient'
          }
        },
        {
          '$addFields': {
            'date': {
              '$toDate': '$datetime'
            }
          }
        }, {
          '$addFields': {
            'day': {
              '$dayOfMonth': '$date'
            },
            'month': {
              '$month': '$date'
            }
          }
        },
        {
          $match: {
            doctorId: AppService.session(req).userId,
            date: dayFilter
            //  day: dayFilter,
            // month: monthFilter
          },
        }
      ], callback);
    },
    function (callback) {
      Appointment.aggregate([{
        $group: {
          _id: null,
          'connected': {
            "$sum": {
              "$cond": [{ "$in": ["Connected", "$status"] }, 1, 0]
            }
          },
          'waiting': {
            "$sum": {
              "$cond": [{ "$in": ["Waiting", "$status"] }, 1, 0]
            }
          },
          'scheduled': {
            "$sum": {
              "$cond": [{ "$in": ["Scheduled", "$status"] }, 1, 0]
            }
          },
          'cancelled': {
            "$sum": {
              "$cond": [{ "$in": ["Cancelled", "$status"] }, 1, 0]
            }
          },
          'completed': {
            "$sum": {
              "$cond": [{ "$in": ["Completed", "$status"] }, 1, 0]
            }
          }
        }
      }], callback);
    }
  ],
    function (err, results) {
      if (err) {
        AppService.errorHandling(err, req, res);
      } else {
        _.forEach(results[0], (value, key) => {
          value.patient[0].dateOfBirth = decrypt(value.patient[0].dateOfBirth);
        }) 
        let data = {
          list: results[0],
          count: (results[1][0]) ? results[1][0] : []
        }
        AppService.sendResponse(res, true, "Appointment List!", data);
      }

    });
});
router.post("/getPatientAppointments", AppService.authGuard, function (req, res, next) { 
  var dayFilter = { $gte: moment(req.body.startOf).toDate(), $lte: moment(req.body.endOf).toDate() } 
  async.parallel([
    function (callback) {
      Appointment.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'doctorId',
            'foreignField': '_id',
            'as': 'doctor'
          }
        },
        {
          '$addFields': {
            'date': {
              '$toDate': '$datetime'
            }
          }
        }, {
          '$addFields': {
            'day': {
              '$dayOfMonth': '$date'
            },
            'month': {
              '$month': '$date'
            }
          }
        },
        {
          $match: {
            patientId: AppService.session(req).userId,
            createdByDoctor: false,
            date: dayFilter
          },
        }
      ], callback);
    },
    function (callback) {
      Appointment.aggregate([{
        $group: {
          _id: null,
          'connected': {
            "$sum": {
              "$cond": [{ "$in": ["Connected", "$status"] }, 1, 0]
            }
          },
          'waiting': {
            "$sum": {
              "$cond": [{ "$in": ["Waiting", "$status"] }, 1, 0]
            }
          },
          'scheduled': {
            "$sum": {
              "$cond": [{ "$in": ["Scheduled", "$status"] }, 1, 0]
            }
          },
          'cancelled': {
            "$sum": {
              "$cond": [{ "$in": ["Cancelled", "$status"] }, 1, 0]
            }
          },
          'completed': {
            "$sum": {
              "$cond": [{ "$in": ["Completed", "$status"] }, 1, 0]
            }
          }
        }
      }], callback);
    }
  ],
    function (err, results) {
      // console.log("results", results)
      if (err) {
        AppService.errorHandling(err, req, res);
      } else {
        let data = {
          list: results[0],
          count: (results[1][0]) ? results[1][0] : []
        }
        AppService.sendResponse(res, true, "Appointment List!", data);
      }

    });
});




router.get("/getAppointment/:id", AppService.authGuard, function (
  req,
  res,
  next
) {


  AppointmentService.getAppointment({ authToken: req.params.id }, (result) => {

    if (result.status) {
      Appointment.aggregate(
        [
          {
            $lookup: {
              from: "patients",
              localField: "patientId",
              foreignField: "_id",
              as: "patient",
            },
          },
          {
            $lookup: {
              from: "patient_visit_foms",
              localField: "_id",
              foreignField: "appointmentId",
              as: "visitForm",
            },
          },
          {
            $lookup: {
              from: "patient_visit_foms",
              localField: "patientId",
              foreignField: "patientId",
              as: "visitFormList",
            },
          },
          {
            $match: {
              _id: mongoose.Types.ObjectId(result.data._id)
            },
          },
        ],
        function (err, appointments) {
          if (err) {
            AppService.errorHandling(err, req, res);
          } else {
            appointments.forEach((appoint) => {
              appoint.patient[0].dateOfBirth = decrypt(appoint.patient[0].dateOfBirth);
              appoint.visitForm = listDecryption(appoint.visitForm, ["visitFormData"]);
              appoint.visitFormList = listDecryption(appoint.visitFormList, ["visitFormData"]);
            })
            AppService.sendResponse(res, true, "Get Appointment Details!", (appointments));
          }
        }
      );
    }

  })

});


router.post("/getAvailabilities", AppService.authGuard, (req, res, next) => {
  Availability.find({ urgentCare: true }, (err, result) => {
    AppService.sendResponse(res, true, "Get Availabilities Details!", (result));
  })
})


module.exports = router;
