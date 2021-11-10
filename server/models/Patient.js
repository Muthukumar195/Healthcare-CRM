var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var encryptFields = [
  "email",
  "mobile",
  "dateOfBirth"
];

// create a user schema
var patientSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    email: { type: String },
    password: { type: String },
    userRole: { type: String, default: "patient" },
    mobile: { type: String },
    pharmacy: {
      name: { type: String, default: "CVS Pharmacy" },
      address: { type: String, default: "3902 Main St, Kansas City - (816) 931-5452" },
      status: { type: String, default: "Closed - Open tommorow 8 AM" },
      phone: { type: String, default: "979-543-5565" }
    },
    visitForm: {
      type: Array,
      default: []
    },
    inviteType: { type: Number },
    providerId: { type: Schema.Types.ObjectId, ref: "users" },
    isDeleted: Boolean,
    authCode: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    password: { type: String, required: false },
    lastAttempt: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    timeZone: {type: String, default:"America/Los_Angeles" },
    forgotPassword: { type: String },
    registeredBy: { type: Number },
    emailOTP: { type: String },
    mobileOTP: { type: String },
    verifyMode: { type: Number },

  },
  { timestamps: true }
);

// var IntakeFormSchema = new Schema(
//   {
//     patientId: { type: Schema.Types.ObjectId, ref: "patients" },
//     visitReason: { type: String },
//     pastHistory: { type: String },
//     medications: { type: String },
//     allergies: { type: String },
//     intakeAttachments: { type: String },
//   },
//   { timestamps: true }
// );

patientSchema.virtual("encryptFields").get(function () {
  return encryptFields;
});
module.exports = mongoose.model("patients", patientSchema);
// module.exports = mongoose.model("intakeform", IntakeFormSchema);
