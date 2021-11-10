// grab the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a user schema
var userSchema = new Schema(
  {
    prefix: { type: String, default: null },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    suffix: { type: String, default: null },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    userRole: { type: String, default: "admin" },
    forgotPassword: { type: String },
    lastAttempt: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    timeZone: {type: String, default:"America/Los_Angeles" },
    isDeleted: Boolean,
    isAvailableForUrgentCare: { type: Boolean, default: false },
    profileImage: { type: String },
    preferences: { type: Schema.Types.ObjectId, ref: "preferences" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
