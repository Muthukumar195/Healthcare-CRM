/* Base API URL */
import config from "./index";

export const AUDIT_LOG = config.apiBaseUrl + "/api/users/auditLog";
/* AUTH */
export const AUTH = {
  LOGIN: config.apiBaseUrl + "/api/users/login",
  UPDATE_USER: config.apiBaseUrl + "/api/users/updateProfile",
  CHANGE_PASSWORD: config.apiBaseUrl + "/api/users/updatePassword",
  FORGOT_PASSWORD: config.apiBaseUrl + "/api/users/forgotPassword",
  PATIENT_FORGOT_PASSWORD: config.apiBaseUrl + "/api/patient/users/forgotPassword",
  RESET_PASSWORD: config.apiBaseUrl + "/api/users/resetPassword",
  PATIENT_RESET_PASSWORD: config.apiBaseUrl + "/api/patient/users/resetPassword",
  PROFILE_PICTURE: config.apiBaseUrl + "/api/users/uploadProfilePicture",
  PATIENT_LOGIN: config.apiBaseUrl + "/api/users/patientLogin",
  SET_URGENT_CARE_STATUS: config.apiBaseUrl + "/api/users/setUrgentCareStatus",
  AUDIT_LOG: config.apiBaseUrl + "/api/users/auditLog",


};


export const PATIENT = {
  GET: config.apiBaseUrl + "/api/patient",
  GET_PATIENT_INTAKE: config.apiBaseUrl + "/api/patient/getPatientIntakeForm",
  SEND_INVITE: config.apiBaseUrl + "/api/patient/sendInvite",
  IMPORT: config.apiBaseUrl + "/api/patient/patientImport",
  REGISTER_PATIENT: config.apiBaseUrl + "/api/patient/registerPatient",
  SAVE_INTAKE: config.apiBaseUrl + "/api/patient/saveIntakeForm",
  GET_INTAKE: config.apiBaseUrl + "/api/patient/getIntakeFormData",
  VERIFY_OTP: config.apiBaseUrl + "/api/patient/verifyOTP",
  SET_PASSWORD: config.apiBaseUrl + "/api/patient/setPassword",
  ADD_APPOINTMENT: config.apiBaseUrl + "/api/appointment/addAppointment",
  ADD_PATIENT_APPOINTMENT: config.apiBaseUrl + "/api/appointment/addPatientAppointment",
  CANCEL_APPOINTMENT: config.apiBaseUrl + "/api/appointment/cancelAppointment",
  GET_APPOINTMENTS: config.apiBaseUrl + "/api/appointment/getAppointments",
  GET_PATIENT_APPOINTMENTS: config.apiBaseUrl + "/api/appointment/getPatientAppointments",
  GET_AVAILABILITIES: config.apiBaseUrl + "/api/appointment/getAvailabilities",
  GET_APPOINTMENT: config.apiBaseUrl + "/api/appointment/getAppointment",
  GET_ICD_CODES: config.apiBaseUrl + "/api/patient/icdCodes",
  VISIT_FORM: config.apiBaseUrl + "/api/patient/visitForm",
  VERIFY_TOKEN: config.apiBaseUrl + "/api/patient/verifyToken",
  VERIFY_MOBILE: config.apiBaseUrl + "/api/patient/verifyMobile",
  GET_PATIENT_DOCUMENTS: config.apiBaseUrl + "/api/patient/getPatientDocuments",
};

export const DOCTOR = {
  GET_AVAILABILITIES: config.apiBaseUrl + "/api/doctor/getAvailabilities",
  GET_DOCTOR_AVAILABILITY: config.apiBaseUrl + "/api/doctor/getDoctorAvailability",
  UPDATE_DOCTOR_AVAILABILITY: config.apiBaseUrl + "/api/doctor/updateDoctorAvailability",
  CANCLE_URGENT_CARE_APPOINTMENTS: config.apiBaseUrl + "/api/appointment/cancleUrgentCareAppointments",
  AUDIT_LOGS: config.apiBaseUrl + "/api/doctor/getAuditLogs",
};



export const PAYMENT = {
  POST: config.apiBaseUrl + "/api/payment/createPaymentIntent",
  SAVE_APPOINTMENT_PAYMENT: config.apiBaseUrl + "/api/payment/saveAppointmentPayments",
  GET_TELEVISIT_FEE: config.apiBaseUrl + "/api/payment/getTelevisitFee",

};
export const VIDEO = {
  POST: config.apiBaseUrl + "/api/video/getToken",
  SESSION_DISCONNECT: config.apiBaseUrl + "/api/video/sessionDisconnect",
  WAITING_ROOM: config.apiBaseUrl + "/api/video/waitingRoom",
  GET_APPOINTMENT_TOKEN: config.apiBaseUrl + "/api/video/getAppointmentToken",
  APP_SESSION_DISCONNECT: config.apiBaseUrl + "/api/video/disconnectAppointmentSession",
  SEND_VIDEO_LOGS: config.apiBaseUrl + "/api/video/logVideoSession",
  SEND_UN_AUTH_VIDEO_LOGS: config.apiBaseUrl + "/api/video/logunAuthVideoSession",
  GET_VIDEO_SESSION_LOGS: config.apiBaseUrl + "/api/video/getVideoSessionLogs",
};

export const USERS = {
  UPDATE_PREFERENCES: config.apiBaseUrl + "/api/users/updatePreferences",
  ACCESS: config.apiBaseUrl + "/api/users/access",
  GET_PREFERENCES: config.apiBaseUrl + "/api/users/getPreferences",
};

export const ProfileImage = {
  path: config.apiBaseUrl + "/profilePic/",
};

export const IntakeFormImage = {
  path: config.apiBaseUrl + "/IntakePic/",
};
