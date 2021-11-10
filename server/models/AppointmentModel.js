var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var appointmentStatus = [
  "Connected",
  "Waiting",
  "Scheduled",
  "paymentAuthorized",
  "Cancelled",
  "Completed",
];
var AppointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "patients",
      //required: [true, 'Patient Name is required']
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      //required: [true, 'Doctor Name is required']
    },
    sessionId: {
      type: String,
    },
    datetime: {
      type: String,
      //required: [true, 'Appointment Date is required']
    },
    timeZone: {
      type: String,
      default:"America/Los_Angeles",
    },
    length: {
      type: Number,
      default: 0,
    },
    reminder: {
      type: Boolean,
      default: true,
    },
    notificationReminder: {
      type: Number,
      default: 0,
    },
    createdByDoctor:{
      type: Boolean,
      default: true
    },
    authToken: {
      type: String,
    },
    status: [{ type: String, enum: appointmentStatus }],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

AppointmentSchema.virtual("appointmentStatus").get(function () {
  return appointmentStatus;
});

module.exports = mongoose.model("appointment", AppointmentSchema);
