import { history } from "../../../history";
import { AUTH, PATIENT } from "../../../configs/ApiActionUrl";
import { getRoleApiUrl } from "../../../components";
import { post, get } from "../../../components/AjaxConfig";
import {
  setLocalStorage,
  clearLocalStorage,
  getLoggedInUser,
  updateUserStorage,
  updateUserProfileStorage,
  setDataLocalStorage,

} from "../../../components/Auth";

export const login = (formData) => {
  return (dispatch) => {
    return post(AUTH.LOGIN, formData)
      .then((response) => {
        dispatch(authStatus("LOGIN", false, response.data));
        if (response.data.status) {
          setLocalStorage(response.data, () => {
            history.push("/");
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const plogin = (formData) => {
  return (dispatch) => {
    formData.appointmentId = localStorage.getItem("appointmentId");
    post(AUTH.PATIENT_LOGIN, formData)
      .then((response) => {
        dispatch(authStatus("PATIENT_LOGIN", false, response.data));
        if (response.data.status) {
          setLocalStorage(response.data, () => {
            history.push(response.data.redirect);
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};
export const setUrgentStatus = (status) => {
  return (dispatch) => {
    post(AUTH.SET_URGENT_CARE_STATUS, { status: status })
      .then((response) => {
        dispatch(authStatus("URGENT_CARE_STATUS", false, response.data));
        if (response.data.status) {
          updateUserStorage(response.data);

        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const verifyToken = (token) => {
  return (dispatch) => {
    post(PATIENT.VERIFY_TOKEN, { token: token })
      .then((response) => {
        dispatch(authStatus("VERIFY_TOKEN", false, response.data));

      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};
export const verifyMobileToken = (token) => {
  return (dispatch) => {
    post(PATIENT.VERIFY_MOBILE, { token: token })
      .then((response) => {
        dispatch(authStatus("VERIFY_MOBILE", false, response.data));

      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const setAuthendicateUser = () => {
  return (dispatch) => {
    dispatch(authStatus("LOGIN", false, { user: getLoggedInUser() }));
  };
};

export const setAppointmentId = (id) => {
  return (dispatch) => {
    setDataLocalStorage("appointmentId", id);
  };
};

export const logout = (role) => {
  return (dispatch) => {
    let userRole = role;
    console.log(userRole)
    clearLocalStorage(() => {
      if (userRole == "admin") {
        history.push("/doctor");
      } else {
        history.push("/patient");
      }
    });
  };
};

export const updateUser = (formData) => {
  return (dispatch) => {
    post(getRoleApiUrl(AUTH.UPDATE_USER), formData)
      .then((response) => {
        dispatch(authStatus("USER", false, response.data));
        if (response.data.status) {
          console.log(response.data);
          updateUserStorage(response.data, () => {
            dispatch(authStatus("LOGIN", false, { user: getLoggedInUser() }));
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const changePassword = (formData) => {
  return (dispatch) => {
    post(getRoleApiUrl(AUTH.CHANGE_PASSWORD), formData)
      .then((response) => {
        dispatch(authStatus("CHANGE_PASSWORD", false, response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const forgotPassword = (formData) => {
  return (dispatch) => {
    return post(AUTH.FORGOT_PASSWORD, formData)
      .then((response) => {
        dispatch(authStatus("FORGOT_PASSWORD", false, response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const patientForgotPassword = (formData) => {
  return (dispatch) => {
    post(AUTH.PATIENT_FORGOT_PASSWORD, formData)
      .then((response) => {
        dispatch(authStatus("FORGOT_PASSWORD", false, response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export const resetPassword = (formData) => {
  return (dispatch) => {
    return post(AUTH.RESET_PASSWORD, formData)
      .then((response) => {
        dispatch(authStatus("RESET_PASSWORD", false, response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};
export const patientResetPassword = (formData) => {
  return (dispatch) => {
    post(AUTH.PATIENT_RESET_PASSWORD, formData)
      .then((response) => {
        dispatch(authStatus("RESET_PASSWORD", false, response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};


export const updateProfilePic = (formData) => {
  return (dispatch) => {
    post(AUTH.PROFILE_PICTURE, formData)
      .then((response) => {
        dispatch(authStatus("PROFILE_PICTURE", false, response.data));
        if (response.data.status) {
          console.log(response.data);
          updateUserProfileStorage(response.data, () => {
            dispatch(authStatus("LOGIN", false, { user: getLoggedInUser() }));
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};

export function authStatus(type, loading, result = {}, error) {
  return { type, loading, result, error };
}
