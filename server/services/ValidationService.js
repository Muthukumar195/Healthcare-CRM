const _ = require('lodash');

const visitFormValidation = (postData, callback) => {
  // console.log(postData)
  var errors = "";
  var valid = true;
  var hipCount = physicalCount = icdCount = 0;
  var physicalValidation = ["peCardiovascular", "peConstitutional", "peENMT",
    "peGastrointestinal", "peMusculoskeletal", "peNeurologic", "pePsychiatric",
    "peRespiratory", "peSkin"]
  _.forEach(postData.hpi, (value, key) => {
    if (!_.isEmpty(value)) {
      hipCount = (hipCount + 1);
    }
  })
  _.forEach(postData, (formData, Fkey) => {
    if (_.includes(physicalValidation, Fkey)) {
      _.forEach(postData[Fkey], (checked, key) => {
        if (checked) {
          physicalCount = physicalCount + 1
        }
      });
    }
  })

  _.forEach(postData.icd, (value, key) => {
    if (!_.isEmpty(value.code)) {
      icdCount = (icdCount + 1);
    }
  })
  if (hipCount < 1) {
    valid = false;
    errors = "Provide atleast one input on HPI";
  }
  if (valid && physicalCount === 0) {
    valid = false;
    errors = "Provide atleast one input on Physical Exam";
  }
  if (valid && _.isEmpty(postData.mdmResult)) {
    valid = false;
    errors = "Select atleast one MDM ";
  }
  if (valid && icdCount === 0) {
    valid = false;
    errors = "Select atleast ICD code";
  }
  callback(valid, errors)
}

module.exports = { visitFormValidation };  
