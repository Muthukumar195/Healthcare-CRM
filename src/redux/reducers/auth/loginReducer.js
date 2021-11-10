export const INIT_STATE = {
  login: [],
  user: [],
  changePassword: null,
  loading: false,
  userRole: "",
  verify_token: [],
  verify_mobile: [],
  urgent_care_status: []
};

export const login = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        loading: action.loading,
        login: action.result,
        userRole:
          action.result.user != null ? action.result.user.userRole : "admin",
      };
    }
    case "PATIENT_LOGIN": {
      return {
        ...state,
        loading: action.loading,
        login: action.result,
        userRole: "patient",
      };
    }
    case "VERIFY_TOKEN": {
      return {
        ...state,
        loading: action.loading,
        verify_token: action.result,

      };
    }
    case "VERIFY_MOBILE": {
      return {
        ...state,
        loading: action.loading,
        verify_mobile: action.result,

      };
    }
    case "URGENT_CARE_STATUS": {
      return {
        ...state,
        loading: action.loading,
        urget_care_status: action.result,

      };
    }
    case "USER": {
      return { ...state, loading: action.loading, user: action.result };
    }
    case "CHANGE_PASSWORD": {
      return {
        ...state,
        loading: action.loading,
        changePassword: action.result,

      };
    }
    case "FORGOT_PASSWORD": {
      return {
        ...state,
        loading: action.loading,
        forgotPassword: action.result,
      };
    }
    case "RESET_PASSWORD": {
      return {
        ...state,
        loading: action.loading,
        resetPassword: action.result,
      };
    }
    case "PROFILE_PICTURE": {
      return {
        ...state,
        loading: action.loading,
        profilePicture: action.result,
      };
    }
    default: {
      return state;
    }
  }
};
