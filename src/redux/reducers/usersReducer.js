const INIT_STATE = {
  settings: [],
  getPerferences: [],
  userAccess:{}
};

const usersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "UPDATE_PREFERENCES": {
      return { ...state, settings: action.result };
    }
    case "ACCESS": {
      return { ...state, userAccess: action.result };
    }
    case "GET_PREFERENCES": {
      return { ...state, getPerferences: action.result };
    }
    default: {
      return state;
    }
  }
};

export default usersReducer;
