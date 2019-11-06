import { AUTH_LOGIN } from "../actions/profileActions";
import { LOGOUT } from "../actions/profileActions";

//Reducer listening to action types

export default function(state = {}, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      console.log("Inside Reducer", action.payload);

      return {
        ...state,
        result: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        result: action.payload
      };

    default:
      return state;
  }
}
