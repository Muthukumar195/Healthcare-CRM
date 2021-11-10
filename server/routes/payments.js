const express = require("express");
const router = express.Router();
const AppService = require("../services/AppService");
const AppointmentPayment = require("../models/AppointmentPayment.js");
const Appointment = require("../models/AppointmentModel.js");
const _ = require("lodash");
const stripe = require("stripe")(
  "sk_test_51HEoMTAWkhcS9lGW6CrDoBDJhvWsvBlSH5yifK2sWXrzley4LnOrqHrIV6ptCtTQorg8OoPPfDeaHFXn7B710pid00Zx4vesZD"
);
const AppointmentService = require("../services/AppointmentService.js");

router.post("/createPaymentIntent", async (req, res, next) => {
  const body = req.body;
  req.body.message = `Payment initiated`;
  AppService.auditLog(req, "M2: Payment"); 
  console.log(req.body.appointmentId);
  validateAppointment(req.body, (data) => {
    req.body.message = `Validated Payment appointment`;
      AppService.auditLog(req, "M2: Payment"); 
    AppointmentService.getAppointmentData(req.body.appointmentId, async (result) => {
      if (!result.status) {
        req.body.message = `Payment AppointmentData Failed`;
        AppService.auditLog(req, "M2: Payment"); 
      } else {
        console.log(result)
        if (!result.data.createdByDoctor) {
          var amt = 100;
        } else {
          var amt = result.data.preferences[0].feePerVisit * 100;
        }
        const options = {
          amount: amt,
          currency: "USD",
          capture_method: "manual",
        };
        // console.log(options);
        try {
          const paymentIntent = await stripe.paymentIntents.create(options);
          req.body.message = `Appointment Payment Success`;
          AppService.auditLog(req, "M2: Payment"); 
          AppService.sendResponse(
            res,
            true,
            "Payment Intent created!",
            paymentIntent
          );
          
        } catch (err) {
          req.body.message = `Appointment Payment Failed`;
          AppService.auditLog(req, "M2: Payment"); 
          AppService.errorHandling(err, req, res, result);         
        }
      }
    });

  });
});
 
var validateAppointment = (formData, callback) => {
  AppointmentService.getAppointmentData(formData.appointmentId, (result) => {
    if (result.status) {
      if (result.data.status[0] == "paymentAuthorized") {
        var isPaymentAuthorized = true;
      } else {
        var isPaymentAuthorized = false;
      }
      callback({ status: true, isPaymentAuthorized: isPaymentAuthorized });
    } else {
      callback({ status: false });
    }

  });

};

router.post("/saveAppointmentPayments", function (req, res, next) {
  var appointmentPaymentData = new AppointmentPayment({
    appointment_id: req.body.appointmentId,
    payment_intent_id: req.body.intentData.id,
    amount: req.body.intentData.amount,
    status: "5f4fc363e455194facdbfcd6",
  });
  console.log(appointmentPaymentData);

  appointmentPaymentData.save().then((payment) => {
    //Patient verification Mode

    Appointment.findByIdAndUpdate(req.body.appointmentId, {
      $set: { "status": "paymentAuthorized", "authToken": req.body.intentData.id },
    }).then((err, result) => {
      res.json({
        status: true,
        message: "Payment captured successfuylly!",
        data: payment,
        redirect_id: req.body.intentData.id
      });
    });


  });
});

router.post("/getTeleVisitFee", function (req, res, next) {

  var appointmentId = req.body.appointmentId;
  AppointmentService.getAppointmentData(appointmentId, (result) => {

    if (result.status) {
      if (result.data.status[0] == "paymentAuthorized" || result.data.status[0] == "Completed") {
        var isPaymentAuthorized = true;
      } else {
        var isPaymentAuthorized = false;
      }

      var televisitFee = 0;
      if (!_.isEmpty(result.data.preferences)) {
        console.log(result.data)
        var televisitFee = (result.data.preferences[0].feePerVisit != null) ? result.data.preferences[0].feePerVisit : 0;
        var hasSkipPayment = (result.data.preferences[0].hasSkipPayment != null) ? result.data.preferences[0].hasSkipPayment : false;

      }
      if (!hasSkipPayment) {
        if (televisitFee > 0) {
          var hasSkipPayment = false;
        } else {
          var hasSkipPayment = true;
        }
      }

      if (!result.data.createdByDoctor) {
        var hasSkipPayment = false;
        televisitFee = 1;
      }



      res.json({
        status: true,
        fee: televisitFee,
        hasSkipPayment: hasSkipPayment,
        isPaymentAuthorized: isPaymentAuthorized

      })
    } else {
      res.json({
        status: false,

      })
    }
  })

});




module.exports = router;
