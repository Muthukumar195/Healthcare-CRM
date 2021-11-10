import { history } from "../../history";
import { PATIENT } from "../../configs/ApiActionUrl";
import { post, get, errorHandling } from "../../components/AjaxConfig";
import moment from "moment-timezone";
export const getPatient = () => {
  return (dispatch) => {
    get(PATIENT.GET)
      .then((response) => {
        dispatch(status("PATIENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getPatientIntake = (id, appointmentId) => {
  return (dispatch) => {
    get(`${PATIENT.GET_PATIENT_INTAKE}/${id}/${appointmentId}`)
      .then((response) => {
        dispatch(status("GET_PATIENT_INTAKE", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const sendInvite = (formData) => {
  return (dispatch) => {
    post(PATIENT.SEND_INVITE, formData)
      .then((response) => {
        dispatch(status("SEND_INVITE", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const registerPatient = (formData) => {
  return (dispatch) => {
    post(PATIENT.REGISTER_PATIENT, formData)
      .then((response) => {
        dispatch(status("REGISTER_PATIENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const saveIntakeForm = (formData) => {
  return (dispatch) => {
    console.log("formData", formData);
    const data = new FormData();
    if (formData.filesToUpload != undefined && formData.filesToUpload != "") {
      formData.filesToUpload.forEach((file) => {
        data.append("files", file, file.name);
      });
    }

    for (var key in formData) {
      data.append(key, formData[key]);
    }

    post(PATIENT.SAVE_INTAKE, data)
      .then((response) => {
        dispatch(status("SAVE_INTAKE", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getIntakeData = (formData) => {
  return (dispatch) => {
    post(PATIENT.GET_INTAKE, formData)
      .then((response) => {
        dispatch(status("GET_INTAKE", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const verifyOTP = (formData) => {
  return (dispatch) => {
    post(PATIENT.VERIFY_OTP, formData)
      .then((response) => {
        dispatch(status("VERIFY_OTP", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const setPassword = (formData) => {
  return (dispatch) => {
    post(PATIENT.SET_PASSWORD, formData)
      .then((response) => {
        dispatch(status("SET_PASSWORD", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const addAppointment = (formData) => {
  return (dispatch) => {
    post(PATIENT.ADD_APPOINTMENT, formData)
      .then((response) => {
        dispatch(status("ADD_APPOINTMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const addPatientAppointment = (formData) => {
  return (dispatch) => {
    post(PATIENT.ADD_PATIENT_APPOINTMENT, formData)
      .then((response) => {
        dispatch(status("ADD_PATIENT_APPOINTMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const cancelAppointment = (id) => {
  return (dispatch) => {
    post(PATIENT.CANCEL_APPOINTMENT, { id: id })
      .then((response) => {
        dispatch(status("CANCEL_APPOINTMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const cancelPatientAppointment = (id) => {
  return (dispatch) => {
    post(PATIENT.CANCEL_APPOINTMENT, { id: id })
      .then((response) => {
        dispatch(status("CANCEL_PATIENT_APPOINTMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const getAppointments = (date, view) => {
  var start = moment(date).startOf('day').utc().format()  
  var end = moment(date).endOf('day').utc().format()
  if (view == "week") {
    start = moment(date).startOf('isoWeek').utc().format()  
    end = moment(date).endOf('isoWeek').utc().format()
  } 
  return (dispatch) => {
    post(PATIENT.GET_APPOINTMENTS, { 
      date:  date,
      startOf:  start,
      endOf: end,
      view: view 
      })
      .then((response) => {
        dispatch(status("GET_APPOINTMENTS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const getPatientAppointments = (date, view) => {
  var start = moment(date).startOf('day').utc().format()  
  var end = moment(date).endOf('day').utc().format()
  if (view == "week") {
    start = moment(date).startOf('isoWeek').utc().format()  
    end = moment(date).endOf('isoWeek').utc().format()
  } 
  return (dispatch) => {
    post(PATIENT.GET_PATIENT_APPOINTMENTS, { 
      date:  date,
      startOf:  start,
      endOf: end,
      view: view 
      })
      .then((response) => {
        dispatch(status("GET_PATIENT_APPOINTMENTS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
}; 

export const getAppointment = (id) => {
  return (dispatch) => {
    get(`${PATIENT.GET_APPOINTMENT}/${id}`)
      .then((response) => {
        dispatch(status("GET_APPOINTMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};


export const getIcdCodes = () => {
  return (dispatch) => {
    get(PATIENT.GET_ICD_CODES)
      .then((response) => {
        dispatch(status("GET_ICD_CODES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const visitForm = (patientId, formData) => {
  return (dispatch) => {
    post(`${PATIENT.VISIT_FORM}/${patientId}`, formData)
      .then((response) => {
        dispatch(status("VISIT_FORM", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getPatientDocuments = (req) => {
  return (dispatch) => {
    post(PATIENT.GET_PATIENT_DOCUMENTS, req)
      .then((response) => {
        dispatch(status("GET_PATIENT_DOCUMENTS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
}; 

export function status(type, result = {}, error) {
  return { type, result, error };
}
