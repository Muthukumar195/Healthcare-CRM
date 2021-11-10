var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IntakeFormSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "patients" },
    visitReason: { type: String },
    pastHistory: { type: String },
    medications: { type: String },
    allergies: { type: String },
    intakeAttachments: { type: String },
    hasDefaultPharmacy: { type: Boolean },
    images: [],
    pharmacy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("intake_forms", IntakeFormSchema);
