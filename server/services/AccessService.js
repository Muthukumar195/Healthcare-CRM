const _ = require('lodash');
const Appointment = require("../models/AppointmentModel");

const appointmentAccess = (req, query, callback) => { 
  if(req.body.module == "Appointment"){  
    Appointment.countDocuments(query, function (err, count) {
      console.log(count)
      if (count > 0) {
        callback(true);
      } else {
        callback(false)
      }
    });
  } 
};


module.exports = { appointmentAccess };
