var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a user schema
var VideoSessionLogsSchema = new Schema(
  {
    // appoinementId: { type: Schema.Types.ObjectId, ref: "appointments" },
    sessionId: { type: String },
    browser: { type: String },
    isSendInvite: { type: Boolean, default: false },
    OS: { type: String },
    speed: { type: Number },
    userId: {type: String}, 
    isDoctor: { type: Boolean, default: false },
    hasAudioDenied: { type: Boolean, default: false },
    hasVideoDenied: { type: Boolean, default: false },
    hasNoAudioVideo: { type: Boolean, default: false },
    hasVideoRendered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("video_session_logs", VideoSessionLogsSchema);
