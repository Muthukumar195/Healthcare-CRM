import axios from "axios";
import { history } from "../history";
import { getLoggedInToken } from "./Auth";
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";

export const post = (url, data) => {
  if (getLoggedInToken()) {
    axios.defaults.headers.common["Authorization"] = getLoggedInToken();
  }
  axios.defaults.headers.common["Content-Type"] = "multipart/form-data"; 

  return axios({
    method: "post",
    url: url,
    data: data,
  });
};

export const get = (url) => {
  if (getLoggedInToken()) {
    axios.defaults.headers.common["Authorization"] = getLoggedInToken();
  }
  return axios({
    method: "get",
    url: url,
  });
};

export const put = (url, data) => {
  if (getLoggedInToken()) {
    axios.defaults.headers.common["Authorization"] = getLoggedInToken();
  }
  return axios({
    method: "put",
    url: url,
    data: data,
  });
};

export const del = (url, data) => {
  if (getLoggedInToken()) {
    axios.defaults.headers.common["Authorization"] = getLoggedInToken();
  }
  return axios({
    method: "delete",
    url: url,
    data: data,
  });
};

export const errorHandling = (err) => {
  console.log(err);
  if (err) {
    if (err.status == 401) {
      history.push("/misc/not-authorized");
    }
  }
};
