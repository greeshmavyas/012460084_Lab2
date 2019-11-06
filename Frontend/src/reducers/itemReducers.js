import { ADD_ITEM, SELECT_REST } from "../actions/ownerItemActions";

export default function(state = {}, action) {
  switch (action.type) {
    case ADD_ITEM:
      return { ...state, item: action.payload };
    case SELECT_REST:
      return { ...state, item: action.payload };

    default:
      return state;
  }
}
