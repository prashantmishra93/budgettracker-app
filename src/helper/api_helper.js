import axios from "axios"
import * as url from "./url_helper"

let tokenPrefix = "Bearer ";

export const respStatus = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  NOT_AUTHORISED: "You are not authorised.",
};

const baseUrl = "https://budgettracker-api.onrender.com";

const axiosApi = axios.create({
    baseURL: baseUrl
});

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

const makeApiRequest = (
    extension,
    payLoad,
    microservice=url.API_EXTENSION
) => {
    if(!url.NON_AUTHENTICATE_URL.includes(extension)){
      let token = tokenPrefix + localStorage.getItem(url.USER_TOKEN)
      axiosApi.defaults.headers.common['Authorization'] = token
    }
    let finalURL = url.API_PREFIX + microservice + extension

    return axiosApi.post(finalURL, payLoad)
          .then((response) => {
            // Correct app-level status check
            if (response.data.status === "ERROR" && response.data.message === "token_expired") {
              localStorage.removeItem(url.USER_TOKEN);
              window.location.href = baseUrl + "/";
            }
            // ✅ Return data so caller gets it
            return response?.headers ? response?.data : response;
          })
          .catch((err) => {
            catchAxioExc(err);
          });
}

const generateCatchMsg = (err) => {
  var message;
  if (err?.response && err?.response.status) {
    switch (err.response.status) {
      case 404:
        message = "Sorry! the API you are looking for could not be found";
        break;
      case 500:
        message = "Sorry! something went wrong, please contact our support team";
        break;
      case 401:
        localStorage.removeItem(url.USER_TOKEN);
        window.location.href = baseUrl + "/";
        message = "Invalid credentials";
        break;
      case 403:
        message = "Invalid Authentication";
        break;
      case 400:
        message = "Missing Something Form Data";
        break;
      case 504:
        message = "Server Error";
        break;
      default:
        message = err[1];
        break;
    }
    return message;
  }
};

const catchAxioExc = (err) => {
  var message = generateCatchMsg(err);
  showMessage({"message": message}, "error");
};

const showMessage = (data, toastType, title='') => {
  let message = data;
  if (data) message = data?.message ? data?.message : data?.messages[0] ? data?.messages[0] : "Something wrong !!";
  
  if (!toastType) {
    toastType = data.status === "SUCCESS" ? "SUCCESS" : "Error";
  }
  if (!title) title = toastType === "SUCCESS" ? "Success" : camelCase(toastType);
  toastMessage(message, toastType, title);
};

const camelCase = (message) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};

const toastMessage = (message, type, heading = "Error") => {
  document.getElementById("commonToaster").style.display = "flex";
  document.getElementById("commonToasterHeading").innerHTML = heading;
  document.getElementById("commonToasterBody").innerHTML = message;
};

export { makeApiRequest, url, tokenPrefix, showMessage };
