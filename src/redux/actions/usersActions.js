import { USERS } from "../../configs/ApiActionUrl";
import { post, get, errorHandling } from "../../components/AjaxConfig";

export const updatePreferences = (formdata) => {
  return (dispatch) => {
    post(USERS.UPDATE_PREFERENCES, formdata)
      .then((response) => {
        dispatch(status("UPDATE_PREFERENCES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const access = (formdata) => {
  return (dispatch) => {
    post(USERS.ACCESS, formdata)
      .then((response) => {
        dispatch(status("ACCESS", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export const getPreferences = () => {
  return (dispatch) => {
    get(USERS.GET_PREFERENCES)
      .then((response) => {
        dispatch(status("GET_PREFERENCES", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export function status(type, result = {}, error) {
  return { type, result, error };
}
