const CronJob = require('cron').CronJob;
const config = require("../configs/config");
const App = require("../services/AppService");
const _ = require('lodash');
const AppointmentService = require("../services/AppointmentService"); 

var appointmentCron = new CronJob('* * * * *', function () { 
  AppointmentService.reminderAppointment(10, (result)=>{
    App.log.info({action: 'Appointment Cron', result: result}) 
  }) 
}, null, true, config.timeZone);

appointmentCron.start(); 
module.exports = CronJob;