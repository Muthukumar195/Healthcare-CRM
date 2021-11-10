var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AuditSchema = new Schema(
  {
    reqUser: { type: Object, },    
    action: {  type: String, },
    api: {  type: String, },
    inputParams: {  type: Object, },
    sessionId: { type: String, default: null },
    isSendInvite: { type: Boolean, default: false },
    hasAudioDenied: { type: Boolean, default: false },
    hasVideoDenied: { type: Boolean, default: false },
    hasNoAudioVideo: { type: Boolean, default: false },
    hasVideoRendered: { type: Boolean, default: false },
    message:{type: String, default: ""},
    browser: { type: String },
    platform: { type: Boolean, default: false },
    isDoctor: { type: Boolean, default: false },
    os: { type: String },
    speed: { type: Number }, 
    isAutoGenerated: {type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("auditLog", AuditSchema);
