const INIT_STATE = {
  intent: [],
  appointment_payment_status: [],
  televisit_fee: [],
};

const paymentReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "PAYMENT_INTENT": {
      return { ...state, intent: action.result };
    }
    case "SAVE_APPOINTMENT_PAYMENT": {
      return { ...state, appointment_payment_status: action.result };
    }
    case "GET_TELEVISIT_FEE": {
      return { ...state, televisit_fee: action.result };
    }

    default: {
      return state;
    }
  }
};

export default paymentReducer;
