import { combineReducers } from "redux";
import profileReducers from "./profileReducers";
import profileFetchReducers from "./profileFetchReducers";
import itemReducers from "./itemReducers";
import orderReducers from "./orderReducers";
const rootReducer = combineReducers({
  profile: profileReducers,
  info: profileFetchReducers,
  items: itemReducers,
  orders: orderReducers
});

export default rootReducer;
