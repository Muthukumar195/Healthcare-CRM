import _ from "lodash";
const setLocalStorage = (data, callback) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  // localStorage.setItem('token', JSON.stringify(user));
  setTimeout(callback, 300);
};

const updateUserStorage = (data, callback) => {
  localStorage.setItem("user", JSON.stringify(data.user));
  // localStorage.setItem('token', JSON.stringify(user));
  setTimeout(callback, 300);
};

const updateUserProfileStorage = (data, callback) => {
  localStorage.removeItem("user");
  localStorage.setItem("user", JSON.stringify(data.user));
  // localStorage.setItem('token', JSON.stringify(user));
  setTimeout(callback, 300);
};

const clearLocalStorage = (callback) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("appointmentId");
  // localStorage.setItem('token', JSON.stringify(user));
  setTimeout(callback, 300);
};

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// Gets the logged in user data from local session
const getRoleApiUrl = (url) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!_.isEmpty(user)) {
    if (user.userRole == "patient") {
      let splitUrl = url.split('api');
      return splitUrl[0] + "api/patient" + splitUrl[1];
    }
  }
  return url;
};

// Gets the logged in user data from local session
const getUserRole = () => {
  const user = localStorage.getItem("user");

  const role = JSON.parse(user).userRole;
  if (role) return role;
  return false;
};

// Gets the logged in user data from local session
const getLoggedInToken = () => {
  const token = localStorage.getItem("token");
  if (token) return token;
  return false;
};

//is user is logged in
const isUserAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (token) return true;
  return false;
};

const setDataLocalStorage = (key, data) => {
  localStorage.setItem(key, data);
};
const getDataLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export {
  setLocalStorage,
  getLoggedInToken,
  isUserAuthenticated,
  clearLocalStorage,
  getLoggedInUser,
  updateUserStorage,
  updateUserProfileStorage,
  getUserRole,
  setDataLocalStorage,
  getDataLocalStorage,
  getRoleApiUrl
};
