var mongoose = require("mongoose");
var moment = require("moment-timezone");
var config = require("../configs/config");
var Schema = mongoose.Schema; 

var timeSlotSchema = new Schema({ 
					from: {type : Date},
					to: {type : Date}
					},{ _id : false });
var timing = {from:  moment().set({ hours: 7, minutes: 00, seconds: 00 }).utc().toDate(), to: moment().set({ hours: 14, minutes: 00, seconds: 00 }).utc().toDate()};
var timing2 = {from:  moment().set({ hours: 16, minutes: 00, seconds: 00 }).utc().toDate(), to: moment().set({ hours: 18, minutes: 00, seconds: 00 }).utc().toDate()};
var AvailablitySchema = new Schema(
  { 
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, 'Doctor Name is required']
    }, 
	availablity: {  
		Monday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing, timing2])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		}, 
		Tuesday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		},
		Wednesday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		}, 
		Thursday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		}, 
		Friday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		}, 
		Saturday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		},Sunday:{ 
			timeSlot:{
				 type: [timeSlotSchema],
				 default: () => ([timing])
			}  ,
			dayOff:{
				type: Boolean,
				default: false
			}
		}  
    }, 
    urgentCare: {
      type: Boolean,
      default: false,
    }, 
	lastActivity:{ type : Date, default: Date.now}
  },
  {
    timestamps: true, 
  }
); 

module.exports = mongoose.model("availablity", AvailablitySchema);
