import { history } from "../../history";
import { DOCTOR } from "../../configs/ApiActionUrl";
import { post, get, errorHandling } from "../../components/AjaxConfig"; 

export const getAvailabilities = (date, view) => {
  return (dispatch) => {
    post(DOCTOR.GET_AVAILABILITIES, { date: date, view: view })
      .then((response) => {
        dispatch(status("GET_AVAILABILITIES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getDoctorAvailability = (date, view) => {
  return (dispatch) => {
    post(DOCTOR.GET_DOCTOR_AVAILABILITY, { date: date, view: view })
      .then((response) => {
        dispatch(status("GET_AVAILABILITIES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const updateDoctorAvailability = (state) => {
  return (dispatch) => {
    post(DOCTOR.UPDATE_DOCTOR_AVAILABILITY, state)
      .then((response) => {
        dispatch(status("GET_AVAILABILITIES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
}; 

export const cancleUrgentCareAppointments = () => {
  return (dispatch) => {
    post(DOCTOR.CANCLE_URGENT_CARE_APPOINTMENTS)
      .then((response) => {
        dispatch(status("CANCLE_URGENT_CARE_APPOINTMENTS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getAuditLogs = (req) => {
  return (dispatch) => {
    post(DOCTOR.AUDIT_LOGS, req)
      .then((response) => {
        dispatch(status("AUDIT_LOGS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};


export function status(type, result = {}, error) {
  return { type, result, error };
}
