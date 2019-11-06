import axios from "axios";
import { rooturl } from "../config/settings";
export const AUTH_LOGIN = "AUTH_LOGIN";
export const LOGOUT = "LOGOUT";
export const PROFILE_FETCH = "PROFILE_FETCH";

export function submitCustomerLogin(data) {
  return function(dispatch) {
    console.log("Inside submitCustomerLogin Action");
    axios
      .post("http://" + rooturl + ":3001/grubhub/customer/login", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("cookie1", response.data.cookie1);
          var resultData = {
            email: response.data.cookie2,
            token: response.data.token,
            ownerOrBuyer: response.data.cookie1,
            isAuthenticated: true
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: AUTH_LOGIN,
            payload: resultData
          });
        }
      })
      .catch(err => {
        if (err) {
          // if (err.response.status === 401) {
          var resultData = {
            isAuthenticated: false
          };
          console.log(err);
          console.log("inside res status 401", err);
          dispatch({
            type: AUTH_LOGIN,
            payload: resultData
          });
          //}
        }
      });
  };
}
export function submitOwnerLogin(data) {
  return function(dispatch) {
    console.log("Inside submitOwnerLogin Action");
    axios
      .post("http://" + rooturl + ":3001/grubhub/owner/login", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          var resultData = {
            email: response.data.cookie2,
            ownerOrBuyer: response.data.cookie1,
            token: response.data.token,
            isAuthenticated: true
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: AUTH_LOGIN,
            payload: resultData
          });
        }
      })
      .catch(err => {
        if (err) {
          // if (err.response.status === 401) {
          var resultData = {
            isAuthenticated: false
          };
          console.log(err);
          console.log("inside res status 401", err);
          dispatch({
            type: AUTH_LOGIN,
            payload: resultData
          });
          //}
        }
      });
  };
}
export function logout() {
  return function(dispatch) {
    var resultData = {
      isAuthenticated: false
    };
    dispatch({
      type: LOGOUT,
      payload: resultData
    });
  };
}
