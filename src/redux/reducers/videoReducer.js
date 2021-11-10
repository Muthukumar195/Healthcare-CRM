const INIT_STATE = {
  sessionDetails: [],
  disconnectData: [],
  videoSessionLogs:[]
};

const videoReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "VIDEO": {
      return { ...state, sessionDetails: action.result };
    }
    case "DISCONNECT": {
      return { ...state, disconnectData: action.result };
    }
    case "GET_VIDEO_SESSION_LOGS": {
      return { ...state, videoSessionLogs: action.result };
    }
    default: {
      return state;
    }
  }
};

export default videoReducer;
