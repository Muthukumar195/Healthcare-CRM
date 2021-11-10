
const _ = require('lodash');
const moment = require('moment');
const Appointment = require("../models/AppointmentModel");
const Preferences = require("../models/Users");
const MailService = require("../services/MailService");
const SMSService = require("../services/SMSService");
const mongoose = require("mongoose");

const timeSlotCheck = (result, req) => {
  var isAvailable = true;
  var existAppoint = [];
  _.forEach(result, (appoint) => {
    var format = 'HH:mm:ss';

    var startTime = moment(moment(appoint.datetime).format(format), format);
    var endTime = moment(moment(appoint.datetime).add(appoint.length, 'minutes').format(format), format);
    for (var c = 1; c <= (appoint.length / 10); c++) {
      var reqStartDate = moment(moment(req.datetime).add(1, 'minutes').format(format), format);
      var reqEndDate = moment(moment(req.datetime).add((req.length - 1), 'minutes').format(format), format);
      if (reqStartDate.isBetween(startTime, endTime)) {
        existAppoint.push(appoint._id)
        isAvailable = false;
      }
      if (reqEndDate.isBetween(startTime, endTime)) {
        existAppoint.push(appoint._id)
        isAvailable = false;
      }
    }
  })
  if (!_.isEmpty(req.appointmentId)) {
    var isSlot = _.remove(existAppoint, function (a) { return a != req.appointmentId; });
    if (_.isEmpty(isSlot)) {
      isAvailable = true;
    }
  }
  return isAvailable;
};


const availableDoctorsList = (result, req) => {
  var availableDoctors = [];
  _.forEach(result, (avail) => {
    var format = 'HH:mm:ss';
    var isAvailable = false;
    for (var d = 0; d <= (avail.fromDates.length - 1); d++) {
      var startTime = moment(moment(avail.fromDates[d]).format(format), format);
      var endTime = moment(moment(avail.toDates[d]).format(format), format);
      var reqStartDate = moment(moment(req.datetime).add(1, 'minutes').format(format), format);
      var reqEndDate = moment(moment(req.datetime).add((req.length - 1), 'minutes').format(format), format);
      if (moment(avail.fromDates[d]).format(format) > moment(avail.toDates[d]).format(format)) {
        var fromStart = moment(moment(avail.fromDates[d]).format(format), format);
        var fromEnd = moment(moment("23:59:59", "HH:mm:ss").format(format), format);
        var toStart = moment(moment("00:00:00", "HH:mm:ss").format(format), format);
        var toEnd = moment(moment(avail.toDates[d]).format(format), format); 
        if ((reqStartDate.isBetween(fromStart, fromEnd) || reqEndDate.isBetween(fromStart, fromEnd)) ||
          (reqStartDate.isBetween(toStart, toEnd) || reqEndDate.isBetween(toStart, toEnd))
        ) {
          isAvailable = true
        }
      } else {
        if (reqStartDate.isBetween(startTime, endTime) || reqEndDate.isBetween(startTime, endTime)) {
          isAvailable = true
        }
      }

    }
    if (isAvailable) {
      availableDoctors.push(avail.doctorId)
    }
  })
  console.log(availableDoctors);
  return availableDoctors;
};

const timeSlotCheckForPatient = (action, id, req, callBack) => {
  var matchQry = {
    doctorId: id,
    day: { $eq: moment(req.body.datetime).date() },
    month: {
      $eq: (moment(req.body.datetime).month() + 1),
    }
  }
  if (action == "patient") {
    matchQry = {
      patientId: id,
      day: { $eq: moment(req.body.datetime).date() },
      month: {
        $eq: (moment(req.body.datetime).month() + 1),
      }
    }
  }
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
    $match: matchQry,
  }], (err, result) => {
    if (err) { console.log(err) }
    else {
      callBack(timeSlotCheck(result, req.body))
    }
  });
};


const getReminderAppointments = (remind, callback) => {
  Appointment.aggregate([{
    $lookup: {
      from: 'patients',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
    }
  }, {
    $lookup: {
      from: 'users',
      localField: 'doctorId',
      foreignField: '_id',
      as: 'doctor'
    }
  }, {
    $match: {
      reminder: true,
      datetime: { $eq: moment().add(remind, 'minutes').format('YYYY-MM-DD HH:mm') }
    }
  }], (err, result) => {
    callback(result)
  });
}
const reminderAppointment = (remind = 15, callback) => {
  console.log('current', moment().format('YYYY-MM-DD HH:mm'));
  console.log('get', moment().add(remind, 'minutes').format('YYYY-MM-DD HH:mm'));
  getReminderAppointments(remind, (appointments) => {
    if (!_.isEmpty(appointments)) {
      _.forEach(appointments, (appoint) => {
        MailService.appointmentReminderMail(appoint, false, (mailSend) => {
          if (mailSend) {
            Appointment.findByIdAndUpdate(appoint._id,
              { $set: { reminder: false } },
              { new: true }).then((result) => {
                callback(result)
              })
          } else {
            callback("Mail error")
          }
        })
      })
    }
  });
}

const sendUrgentCareNotification = (appointment, isResheduled, callback) => {
  let hasMailSent = false;
  let hasSMSSent = false;
  Appointment.aggregate([{
    $lookup: {
      from: 'patients',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
    }
  }, {
    $lookup: {
      from: 'users',
      localField: 'doctorId',
      foreignField: '_id',
      as: 'doctor'
    }
  }, {
    $match: {
      _id: mongoose.Types.ObjectId(appointment.id),
    }
  }], (err, result) => {
    console.log(result[0])
    if (!_.isEmpty(result[0].patient[0].email)) {
      MailService.UrgentAppointmentReminderMail(result[0], isResheduled, (mailSend) => {
        if (mailSend) {

          // callback(result)
          hasMailSent = true;


        } else {
          // callback("Mail error")
          hasMailSent = false;
        }
      })
    }
    if (!_.isEmpty(result[0].patient[0].mobile)) {
      console.log("SMS")
      SMSService.appointmentReminderSMS(result[0], (mailSend) => {
        if (mailSend) {

          hasSMSSent = true;

        } else {
          hasMailSent = false;
        }
      })
    }

    callback(result);

  });
};

const sendNotification = (appointment, isResheduled, callback) => {
  let hasMailSent = false;
  let hasSMSSent = false;
  Appointment.aggregate([{
    $lookup: {
      from: 'patients',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
    }
  }, {
    $lookup: {
      from: 'users',
      localField: 'doctorId',
      foreignField: '_id',
      as: 'doctor'
    }
  }, {
    $match: {
      _id: mongoose.Types.ObjectId(appointment.id),
    }
  }], (err, result) => {
    console.log(result[0])
    if (!_.isEmpty(result[0].patient[0].email)) {
      MailService.appointmentReminderMail(result[0], isResheduled, (mailSend) => {
        if (mailSend) {

          // callback(result)
          hasMailSent = true;


        } else {
          // callback("Mail error")
          hasMailSent = false;
        }
      })
    }
    if (!_.isEmpty(result[0].patient[0].mobile)) {
      console.log("SMS")
      SMSService.appointmentReminderSMS(result[0], (mailSend) => {
        if (mailSend) {

          hasSMSSent = true;

        } else {
          hasMailSent = false;
        }
      })
    }

    callback(result);

  });
};

const getAppointmentData = (appointmentId, callback) => {
  console.log(appointmentId)
  if (appointmentId != null) {
    Appointment.findOne({ _id: appointmentId }).exec((err, data) => {
      if (err) {
        console.log(err);
        callback({ status: false });
      } else {
        if (!_.isEmpty(data)) {
          //     callback({ status: true, data: data });
          Appointment.aggregate(
            [
              {
                $lookup: {
                  from: "preferences",
                  localField: "doctorId",
                  foreignField: "providerId",
                  as: "preferences",
                },
              },
              {
                $match: {
                  _id: mongoose.Types.ObjectId(appointmentId),
                },
              },
            ],
            function (error, data) {
              if (error) {
                console.log(error)
                callback({ status: false });
              } else {

                callback({ status: true, data: data[0] });
              }

              //handle error case also
            }
          );
        } else {
          callback({ status: false });
        }

      }

    });
  }


}


const getAppointment = (params, callback) => {
  if (params != null) {
    Appointment.findOne(params).exec((err, data) => {
      if (err) {
        console.log(err);
        callback({ status: false });
      } else {
        console.log(data);
        if (!_.isEmpty(data)) {
          callback({ status: true, data: data });
        }

      }

    });
  }
}

const getAppointmentDetails = (params, callback) => {
  if (params != null) {
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
        $match: params,
      }
    ], (err, data) => {
      if (err) {
        console.log(err);
        callback({ status: false });
      } else {
        console.log(data);
        if (!_.isEmpty(data)) {
          callback({ status: true, data: data[0] });
        }

      }

    });
  }
}

const hasSkipPayment = (userId, callback) => {

  if (userId != null) {
    Preferences.findOne({ providerId: mongoose.Types.ObjectId(userId) }).exec((err, data) => {
      if (err) {
        console.log(err);
        callback({ status: false });
      } else {
        if (!_.isEmpty(data)) {
          if (data.hasSkipPayment) {
            callback({ status: true, data });
          } else {
            callback({ status: false });
          }
        } else {
          callback({ status: true });
        }
      }
    });
  }
}

module.exports = { timeSlotCheck, timeSlotCheckForPatient, availableDoctorsList, reminderAppointment, getReminderAppointments, getAppointmentData, sendNotification, getAppointment, hasSkipPayment, sendUrgentCareNotification, getAppointmentDetails };
