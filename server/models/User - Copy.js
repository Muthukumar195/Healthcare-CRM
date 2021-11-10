// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
   

// create a user schema
var userSchema = new Schema({ 
  firstName: { type: String, required: true },  
  lastName: { type: String, required: true  },
  fullName: { type: String, required: true},
  email : { type: String, required: true,  unique: true},  
  username :{type: String},  
  password: {type: String, required: true},
  companyInfo: {type: String},
  isDeleted: Boolean
},{ timestamps: true });

module.exports = mongoose.model('users', userSchema);