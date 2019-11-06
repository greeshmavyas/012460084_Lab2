import { UPDATE_STATUS } from "../actions/ownerOrderActions";

//Reducer listening to action types

export default function(state = {}, action) {
  switch (action.type) {
    case UPDATE_STATUS:
      console.log("Inside Reducer", action.payload);

      return {
        ...state,
        result: action.payload
      };

    default:
      return state;
  }
}
