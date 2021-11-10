import { combineReducers } from "redux";
import customizer from "./customizer/";
import calendar from "./calendar/";
import auth from "./auth/";
import navbar from "./navbar/Index";
import doctorReducer from "./doctorReducer";
import patientReducer from "./patientReducer";
import videoReducer from "./videoReducer";
import usersReducer from "./usersReducer";
import calendarReducer from "./calendar/";
import paymentReducer from "./paymentReducer";

const rootReducer = combineReducers({
  customizer: customizer,
  calendar: calendar,
  auth: auth,
  navbar: navbar,
  doctor: doctorReducer,
  patient: patientReducer,
  video: videoReducer,
  users: usersReducer,
  calendar: calendarReducer,
  payment: paymentReducer,
});

export default rootReducer;
