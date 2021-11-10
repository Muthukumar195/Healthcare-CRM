// grab the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a user schema
var UrgentCareLogsSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "users" },
    round_value: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("urgent_care_logs", UrgentCareLogsSchema);
