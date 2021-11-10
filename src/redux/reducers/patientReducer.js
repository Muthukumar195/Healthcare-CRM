const INIT_STATE = {
  list: [],
  invite: null,
  intakeFormData: [],
  appointments: [],
  patientIntake: {},
  appointmentDetails: {},
  icdCodes: [],
  documents:[]
};

const patientReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "GET_PATIENT_INTAKE": {
      return { ...state, patientIntake: action.result };
    }
    case "PATIENT": {
      return { ...state, list: action.result };
    }
    case "SEND_INVITE": {
      return { ...state, invite: action.result };
    }
    case "REGISTER_PATIENT": {
      return { ...state, register: action.result };
    }
    case "SAVE_INTAKE": {
      return { ...state, intakeForm: action.result };
    }
    case "GET_INTAKE": {
      return { ...state, intakeFormData: action.result };
    }
    case "VERIFY_OTP": {
      return { ...state, verifyOTP: action.result };
    }
    case "SET_PASSWORD": {
      return { ...state, setPasswordData: action.result };
    }
    case "ADD_APPOINTMENT": {
      return { ...state, addAppointmentData: action.result };
    }
    case "ADD_PATIENT_APPOINTMENT": {
      return { ...state, addPatientAppointmentData: action.result };
    }
    case "CANCEL_APPOINTMENT": {
      return { ...state, addAppointmentData: action.result };
    }
    case "CANCEL_PATIENT_APPOINTMENT": {
      return { ...state, addPatientAppointmentData: action.result };
    }
    case "GET_APPOINTMENTS": {
      return { ...state, appointments: action.result };
    }
    case "GET_PATIENT_APPOINTMENTS": {
      return { ...state, appointments: action.result };
    }
    case "GET_APPOINTMENT": {
      return { ...state, appointmentDetails: action.result };
    }
    case "VISIT_FORM": {
      return { ...state, visit: action.result };
    }
    case "GET_ICD_CODES": {
      return { ...state, icdCodes: action.result };
    }
    case "GET_PATIENT_DOCUMENTS": {
      return { ...state, documents: action.result };
    } 
    default: {
      return state;
    }
  }
};

export default patientReducer;
