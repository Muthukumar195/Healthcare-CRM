var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a appointmentPaymentSchema
var appointmentPaymentSchema = new Schema(
  {
    appointment_id: { type: Schema.Types.ObjectId, ref: "appointments" },
    payment_intent_id: { type: String },
    amount: { type: Number },
    status: { type: Schema.Types.ObjectId, ref: "payment_status" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "appointment_payments",
  appointmentPaymentSchema
);
