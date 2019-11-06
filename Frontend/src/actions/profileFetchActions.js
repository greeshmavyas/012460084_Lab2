import axios from "axios";
import { rooturl } from "../config/settings";
export const PROFILE_FETCH = "PROFILE_FETCH";
export const PROFILE_SAVE = "PROFILE_SAVE";
export const FIRST_NAME = "FIRST_NAME";
export const LAST_NAME = "LAST_NAME";
export const PHONE_NUM = "PHONE_NUM";
export const RNAME = "RNAME";
export const CUISINE = "CUISINE";
export const ZIP_CODE = "ZIP_CODE";
export function customerProfileFetch(data, config) {
  return async function(dispatch) {
    console.log("Inside customerProfileFetch Action");
    await axios
      .post(
        "http://" + rooturl + ":3001/grubhub/customer/profile",
        data,
        config
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status == 200) {
          var resultData = {
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone_number: response.data.phone_number,
            image_name: response.data.image_name,
            status: response.status
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: PROFILE_FETCH,
            payload: resultData
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}
export function ownerProfileFetch(data, config) {
  return function(dispatch) {
    console.log("Inside owner ProfileFetch Action");
    axios
      .post("http://" + rooturl + ":3001/grubhub/owner/profile", data, config)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status == 200) {
          var resultData = {
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone_number: response.data.phone_number,
            image_name: response.data.image_name,
            status: response.status,
            rname: response.data.restaurant_name,
            zip_code: response.data.zip_code,
            cuisine: response.data.cuisine
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: PROFILE_FETCH,
            payload: resultData
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function customerProfileSave(data, config) {
  return async function(dispatch) {
    console.log("Inside customerProfileFetch Action");
    await axios
      .post(
        "http://" + rooturl + ":3001/grubhub/customer/profilesave",
        data,
        config
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status == 200) {
          console.log(response.data);

          alert("Profile Data was succesfully saved!");

          var resultData = {
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone_number: response.data.phone_number,
            image_name: response.data.image_name,
            status: response.status
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: PROFILE_SAVE,
            payload: resultData
          });
        }
      })
      .catch(err => {
        console.log("Error is:", err);
        alert("Profile data save error!");
      });
  };
}

export function ownerProfileSave(data, config) {
  return async function(dispatch) {
    console.log("Inside owner ProfileFetch Action");
    await axios
      .post(
        "http://" + rooturl + ":3001/grubhub/owner/profilesave",
        data,
        config
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status == 200) {
          console.log(response.data);

          alert("Profile Data was succesfully saved!");

          var resultData = {
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone_number: response.data.phone_number,
            image_name: response.data.image_name,
            rname: response.data.restaurant_name,
            zip_code: response.data.zip_code,
            cuisine: response.data.cuisine,
            status: response.status
          };
          console.log("Result in action: ", resultData);
          dispatch({
            type: PROFILE_SAVE,
            payload: resultData
          });
        }
      })
      .catch(err => {
        console.log("Error is:", err);
        alert("Profile data save error!");
      });
  };
}
export function firstnameChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: FIRST_NAME,
      payload: e.target.value
    });
  };
}

export function lastnameChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: LAST_NAME,
      payload: e.target.value
    });
  };
}

export function phonenumberChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: PHONE_NUM,
      payload: e.target.value
    });
  };
}

export function rnameChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: RNAME,
      payload: e.target.value
    });
  };
}
export function cuisineChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: CUISINE,
      payload: e.target.value
    });
  };
}
export function zipcodeChangeHandler(e) {
  return function(dispatch) {
    dispatch({
      type: ZIP_CODE,
      payload: e.target.value
    });
  };
}
