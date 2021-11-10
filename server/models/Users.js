// grab the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var preferencesSchema = new Schema({
  providerId: { type: Schema.Types.ObjectId, ref: "users" },
  emrPreferenceId: { type: Number },
  iframeLink: { type: String },
  paymentPreferenceId: { type: Number },
  feePerVisit: { type: Number },
  hasSkipPayment: Boolean,
});

module.exports = mongoose.model("preferences", preferencesSchema);
