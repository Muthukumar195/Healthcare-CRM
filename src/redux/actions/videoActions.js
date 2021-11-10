import { VIDEO } from "../../configs/ApiActionUrl";
import { post, get, errorHandling } from "../../components/AjaxConfig";

export const getToken = (sessionId) => {
  return (dispatch) => {
    post(VIDEO.POST, sessionId)
      .then((response) => {
        dispatch(status("VIDEO", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const getAppointmentToken = (authToken) => {
  return (dispatch) => {
    post(VIDEO.GET_APPOINTMENT_TOKEN, authToken)
      .then((response) => {
        dispatch(status("VIDEO", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const disconnectSession = (sessionId) => {
  return (dispatch) => {
    post(VIDEO.SESSION_DISCONNECT, sessionId)
      .then((response) => {
        dispatch(status("VIDEO", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const disconnectAppointmentSession = (data) => {
  return (dispatch) => {
    post(VIDEO.APP_SESSION_DISCONNECT, data)
      .then((response) => {
        dispatch(status("DISCONNECT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const sendVideoLogs = (data) => {
  return (dispatch) => {
    post(VIDEO.SEND_VIDEO_LOGS, data)
      .then((response) => {
        // dispatch(status("DISCONNECT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const sendUnAuthVideoLogs = (data) => {
  return (dispatch) => {
    post(VIDEO.SEND_UN_AUTH_VIDEO_LOGS, data)
      .then((response) => {
        // dispatch(status("DISCONNECT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};


export const sendWaitingNotificaiton = (post_data) => {
  return (dispatch) => {
    post(VIDEO.WAITING_ROOM, post_data)
      .then((response) => {
        dispatch(status("WAITING", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getVideoSessionLogs = (req) => {
  return (dispatch) => {
    post(VIDEO.GET_VIDEO_SESSION_LOGS, req)
      .then((response) => {
        dispatch(status("GET_VIDEO_SESSION_LOGS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export function status(type, result = {}, error) {
  return { type, result, error };
}
