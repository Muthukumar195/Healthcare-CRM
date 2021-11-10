const express = require("express");
const router = express.Router();
const async = require("async");
const _ = require("lodash");
var config = require("../configs/config");
const Availability = require("../models/AvailabilityModel");
const Appointment = require("../models/AppointmentModel");
const AuditLog = require("../models/AuditModel");
const AppService = require("../services/AppService.js");
const moment = require("moment");


router.post("/getAvailabilities", AppService.authGuard, (req, res, next) => {
  Availability.find({ urgentCare: true }, (err, avail) => {
    Appointment.find({ status: { $nin: ["Completed"] } }, (err, appoint) => {
      let result = {};
      result.avail = avail;
      result.appoint = appoint;
      AppService.sendResponse(res, true, "Get Availabilities Details!", (result));
    })
  })
})

router.post("/getDoctorAvailability", AppService.authGuard, (req, res, next) => {
  Availability.findOne({ doctorId: req.user._id }, (err, result) => {
    AppService.sendResponse(res, true, "Get Doctor Availability Details!", (result));
  })
})
router.post("/updateDoctorAvailability", AppService.authGuard, (req, res, next) => {
  Availability.findOneAndUpdate({ doctorId: req.user._id }, req.body,
    {
      new: true
    }, (err, result) => {
      AppService.sendResponse(res, true, "Updated Doctor Availability Details!", (result));
    })
})

router.post("/getAuditLogs", AppService.authGuard, function (req, res, next) {
  //let match = {isAutoGenerated: false, reqUser: AppService.session(req).userId};
  let match = { isAutoGenerated: false };
  let skip = (req.body.perPage * (req.body.page - 1))
  let sort = { createdAt: -1 }
  if (req.body.sortable) {
    let sortDirection = (req.body.sortable.sort == "asc") ? 1 : -1;
    sort = { [req.body.sortable.selector]: sortDirection }
  }
  if (req.body.dateFilter.length) {
    var endDate = moment(req.body.dateFilter[1], "YYYY-MM-DD").endOf('day').toDate();
    if (moment(req.body.dateFilter[1]) === moment().format("YYYY-MM-DD")) {
      endDate = moment().endOf('day').toDate()
    }
    match.createdAt = { $gte: moment(req.body.dateFilter[0], "YYYY-MM-DD").startOf('day').toDate(), $lte: endDate };
  }
  if (req.body.search.length) {
    match['$or'] = [
      { 'patient.firstName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'patient.lastName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'doctor.firstName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'doctor.lastName': { $regex: new RegExp(req.body.search, 'i') } },
      { 'action': { $regex: new RegExp(req.body.search, 'i') } },
      { 'createdAt': { $regex: new RegExp(req.body.search, 'i') } },
      { 'logDate': { $regex: new RegExp(req.body.search, 'i') } },
      { 'month': { $regex: new RegExp(req.body.search, 'i') } },
      { 'sessionId': { $regex: new RegExp(req.body.search, 'i') } },
      { 'browser': { $regex: new RegExp(req.body.search, 'i') } },
      { 'OS': { $regex: new RegExp(req.body.search, 'i') } },
      { 'message': { $regex: new RegExp(req.body.search, 'i') } }
    ]
  }

  async.parallel([
    function (callback) {
      AuditLog.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'reqUser',
            'foreignField': '_id',
            'as': 'doctor'
          }
        }, {
          '$lookup': {
            'from': 'patients',
            'localField': 'reqUser',
            'foreignField': '_id',
            'as': 'patient'
          }
        }, {
          '$addFields': {
            'logDate': {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            'logMonth': {
              $month: "$createdAt"
            } 
          }
        },
        {
          '$addFields': {   
            'month': {
              $let: {
                vars: {
                  monthsInString: ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                in: {
                  $arrayElemAt: ['$$monthsInString', 12]
                }
              }
            }
          }
        },
        { $match: match },
        { $sort: sort },
        { $skip: skip },
        { $limit: req.body.perPage }
      ], callback);
    },
    function (callback) {
      AuditLog.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'reqUser',
            'foreignField': '_id',
            'as': 'doctor'
          }
        }, {
          '$lookup': {
            'from': 'patients',
            'localField': 'reqUser',
            'foreignField': '_id',
            'as': 'patient'
          }
        },
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
      AppService.sendResponse(res, true, "Audit Session Logs List", result);
    }
  });

});
module.exports = router;