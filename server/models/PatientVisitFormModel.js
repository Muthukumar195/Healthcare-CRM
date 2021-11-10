var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var encryptFields = [ 
  "visitFormData"
];
var PatientVisitFormSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "appointments",
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "patients",
      //required: [true, 'Patient Name is required']
    },
    visitFormData: {
      type: Object,
    },

  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PatientVisitFormSchema.virtual("encryptFields").get(function () {
  return encryptFields;
});


module.exports = mongoose.model("patient_visit_foms", PatientVisitFormSchema);
