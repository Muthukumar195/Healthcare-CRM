var mongoose = require("mongoose");
var Schema = mongoose.Schema;

 
var IcdSchema = new Schema(
  {
    code: {
      type: String 
    },
  },   
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
); 

module.exports = mongoose.model("icd_codes", IcdSchema);
