const Nexmo = require("nexmo");
const moment = require("moment");
const config = require("../configs/config");
var { decrypt } = require("../services/CryptoService.js");
const nexmo = new Nexmo(config.nexmo);

var appointmentReminderSMS = (data, callBack) => {
  let patient = data.patient[0];
  let doctor = data.doctor[0];
  const from = "13048738828";
  const to = config.countryNumberCode + decrypt(patient.mobile);
  console.log(to);
  const text = `Dear Member,\nYou have an appointment with Dr. ${
    doctor.firstName
    } ${doctor.lastName} on ${moment(data.datetime)
      .tz(data.timeZone)
      .format("MMM DD, YYYY")} at ${moment(data.datetime)
        .tz(data.timeZone)
        .format(
          "hh:mm:ss A"
        )} - ${moment().tz(data.timeZone).format('z')}. \n ${config.baseUrl}/telescrubs/appointment/${data._id} Click here to connect with Dr. ${
    doctor.firstName
    } ${doctor.lastName}
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

module.exports = { appointmentReminderSMS };
