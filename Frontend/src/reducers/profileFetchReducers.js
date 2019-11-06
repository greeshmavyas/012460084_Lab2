import { AUTH_LOGIN } from "../actions/profileActions";
import { LOGOUT } from "../actions/profileActions";
import { PROFILE_FETCH } from "../actions/profileActions";
import {
  PROFILE_SAVE,
  FIRST_NAME,
  PHONE_NUM,
  LAST_NAME,
  RNAME,
  CUISINE,
  ZIP_CODE
} from "../actions/profileFetchActions";

//Reducer listening to action types

export default function(state = {}, action) {
  switch (action.type) {
    case PROFILE_FETCH:
      console.log("in the fetch dispatch" + JSON.stringify(action.payload));
      return { ...state, result: action.payload };

    case PROFILE_SAVE:
      return { ...state, result: action.payload };

    case LAST_NAME: {
      if (state.result) {
        var myresult = state.result;
        myresult.last_name = action.payload;
        return { ...state, result: myresult };
      }
    }
    case FIRST_NAME:
      if (state.result) {
        var myresult = state.result;
        myresult.first_name = action.payload;
        return { ...state, result: myresult };
      }
    case PHONE_NUM:
      if (state.result) {
        var myresult = state.result;
        myresult.phone_number = action.payload;
        return { ...state, result: myresult };
      }

    case RNAME: {
      if (state.result) {
        var myresult = state.result;
        myresult.rname = action.payload;
        return { ...state, result: myresult };
      }
    }
    case CUISINE:
      if (state.result) {
        var myresult = state.result;
        myresult.cuisine = action.payload;
        return { ...state, result: myresult };
      }
    case ZIP_CODE:
      if (state.result) {
        var myresult = state.result;
        myresult.zip_code = action.payload;
        return { ...state, result: myresult };
      }
    default:
      return state;
  }
}
