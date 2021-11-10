var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a paymentStatusSchema
var paymentStatusSchema = new Schema(
  {
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment_status", paymentStatusSchema);
