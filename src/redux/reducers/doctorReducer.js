const INIT_STATE = { 
  availabilities:[],
  cancelAppointmets:[],
  auditLogs:[]
};

const doctorReducer = (state = INIT_STATE, action) => {
  switch (action.type) { 
    case "GET_AVAILABILITIES": {
      return { ...state, availabilities: action.result };
    }
    case "CANCLE_URGENT_CARE_APPOINTMENTS": {
      return { ...state, cancelAppointmets: action.result };
    } 
    case "AUDIT_LOGS": {
      return { ...state, auditLogs: action.result };
    }
    default: {
      return state;
    }
  }
};

export default doctorReducer;
