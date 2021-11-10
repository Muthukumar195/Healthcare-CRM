const nodemailer = require("nodemailer");
const moment = require("moment");
const _ = require("lodash");
const config = require("../configs/config");
var { decrypt } = require("../services/CryptoService.js");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: config.mailCredential,
});

const appointmentReminderMail = (data, isResheduled, callback) => {
  let patient = data.patient[0];
  let doctor = data.doctor[0];

  if (!_.isEmpty(doctor) && !_.isEmpty(patient)) { 
    if (isResheduled) {

      var subject = `Appointment Rescheduled with Dr. ${doctor.firstName} ${doctor.lastName}`;
      var mailContent = `Your appointment with Dr. ${
        doctor.firstName
        } ${doctor.lastName} has been resheduled`;
    } else {
      var subject = `Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`;
      var mailContent = `You have an appointment with Dr. ${
        doctor.firstName
        } ${doctor.lastName}`;
    }

    transporter.sendMail(
      {
        from: '"Team TeleScrubs" telescrubsmd@gmail.com',
        to: decrypt(patient.email),
        subject: subject,
        html: `${mailContent} on ${moment(data.datetime)
          .tz(data.timeZone)
          .format("MMM DD, YYYY")} at ${moment(data.datetime)
            .tz(data.timeZone)
            .format(
            "hh:mm:ss A"
            )} - ${moment().tz(data.timeZone).format('z')}. </br><a href="${config.baseUrl}/telescrubs/appointment/${data._id}" title="Invite link">Click here to connect with Dr. ${
          doctor.firstName
          } ${doctor.lastName}</a></p> 	
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
  } else {
    callback(false);
  }
}
const UrgentAppointmentReminderMail = (data, isResheduled, callback) => {
  let patient = data.patient[0];
  let doctor = data.doctor[0];
  if (!_.isEmpty(doctor) && !_.isEmpty(patient)) {
    if (isResheduled) {

      var subject = `Appointment Rescheduled with Dr. ${doctor.firstName} ${doctor.lastName}`;
      var mailContent = `Your appointment with Dr. ${
        doctor.firstName
        } ${doctor.lastName} has been resheduled`;
    } else {
      var subject = `Urgent Care Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`;
      var mailContent = `You have an appointment with Dr. ${
        doctor.firstName
        } ${doctor.lastName}`;

      var dsubject = `Urgent Care Appointment with Patient ${patient.firstName} ${patient.lastName}`;
      var dmailContent = `An Urgent Care appointment is scheduled with Patient ${
        patient.firstName
        } ${patient.lastName}`;
    }

    transporter.sendMail(
      {
        from: '"Team TeleScrubs" telescrubsmd@gmail.com',
        to: decrypt(patient.email),
        subject: subject,
        html: `${mailContent} on ${moment(data.datetime)
          .tz(data.timeZone)
          .format("MMM DD, YYYY")} at ${moment(data.datetime)
            .tz(data.timeZone)
            .format(
            "hh:mm:ss A"
            )} - ${moment().tz(data.timeZone).format('z')}. </br><a href="${config.baseUrl}/telescrubs/appointment/${data._id}" title="Invite link">Click here to connect with Dr. ${
          doctor.firstName
          } ${doctor.lastName}</a></p> 	
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



    transporter.sendMail(
      {
        from: '"Team TeleScrubs" telescrubsmd@gmail.com',
        to: decrypt(doctor.email),
        subject: dsubject,
        html: `${dmailContent} on ${moment(data.datetime)
          .tz(data.timeZone)
          .format("MMM DD, YYYY")} at ${moment(data.datetime)
            .tz(data.timeZone)
            .format(
            "hh:mm:ss A"
            )} - ${moment().tz(data.timeZone).format('z')}. </br><a href="${config.baseUrl}/telescrubs/appointment/${data._id}" title="Invite link">Click here to connect with Patient ${
          doctor.firstName
          } ${doctor.lastName}</a></p> 	
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
  } else {
    callback(false);
  }


}


const cancleAppointmentMail = (data, callback) => {
  let patient = data.patient[0];
  let doctor = data.doctor[0];

  var subject = `Appointment Cancelled`;
  var mailContent = `Your appointment with Dr. ${
    doctor.firstName
    } ${doctor.lastName} has been cancelled`;

  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: decrypt(patient.email),
      subject: subject,
      html: `${mailContent} 	
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
}

const callDisconnectMail = (data, callback) => {
  let patient = data.patient[0];
  let doctor = data.doctor[0];

  var subject = `Appointment Session ended`;
  var mailContent = `Dear ${patient.firstName} ${patient.lastName},<br/><p>Thank you for your recent appointment with TeleScrubs. Please remember to pick up any medications prescribed during the call (if any)<br>`;

  transporter.sendMail(
    {
      from: '"Team TeleScrubs" telescrubsmd@gmail.com',
      to: decrypt(patient.email),
      subject: subject,
      html: `${mailContent} 	
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
}



module.exports = { appointmentReminderMail, UrgentAppointmentReminderMail, cancleAppointmentMail, callDisconnectMail };
