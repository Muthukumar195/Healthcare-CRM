import { history } from "../../history";
import { PAYMENT } from "../../configs/ApiActionUrl";
import { post, get, errorHandling } from "../../components/AjaxConfig";

export const createPaymentIntent = (form_data) => {
  return (dispatch) => {
    post(PAYMENT.POST, form_data)
      .then((response) => {
        dispatch(status("PAYMENT_INTENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const saveAppointmentPayments = (form_data) => {
  return (dispatch) => {
    post(PAYMENT.SAVE_APPOINTMENT_PAYMENT, form_data)
      .then((response) => {
        dispatch(status("SAVE_APPOINTMENT_PAYMENT", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};
export const getTeleVisitFee = (form_data) => {
  return (dispatch) => {
    post(PAYMENT.GET_TELEVISIT_FEE, form_data)
      .then((response) => {
        dispatch(status("GET_TELEVISIT_FEE", response.data));
      })
      .catch((error) => {
        errorHandling(error.response);
      });
  };
};

export function status(type, result = {}, error) {
  return { type, result, error };
}
