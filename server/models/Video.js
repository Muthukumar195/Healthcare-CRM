var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a user schema
var videoSchema = new Schema(
  {
    sessionId: { type: String },
    email: { type: String },
    mobile: { type: String },
    providerId: { type: Schema.Types.ObjectId, ref: "users" },
    patientId: { type: String, default: null },
    linkStatus: { type: String, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("videos", videoSchema);
