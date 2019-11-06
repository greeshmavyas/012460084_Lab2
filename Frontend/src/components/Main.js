import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Login";
import OwnerHome from "./OwnerHome";
import CustomerSignUp from "./CustomerSignUp";
import OwnerSignUp from "./OwnerSignUp";
import CustomerHome from "./CustomerHome";
import OwnerProfile from "./OwnerProfile";
import Orders from "./Orders";
import Menu from "./Menu";
import AddItem from "./AddItem";
import CustomerProfile from "./CustomerProfile";
import GrubhubHome from "./GrubhubHome";
import SearchItem from "./SearchItem";
import PlaceCustomerOrder from "./PlaceCustomerOrder";
import Cart from "./Cart";
import Checkout from "./Checkout";
import PastOrders from "./PastOrders";
import UpcomingOrders from "./UpcomingOrders";
import ManageOrders from "./ManageOrders";
class Main extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/OwnerHome" component={OwnerHome} />
          <Route path="/CustomerSignUp" component={CustomerSignUp} />
          <Route path="/OwnerSignUp" component={OwnerSignUp} />
          <Route path="/CustomerHome" component={CustomerHome} />
          <Route path="/OwnerProfile" component={OwnerProfile} />
          <Route path="/Orders" component={Orders} />
          <Route path="/Menu" component={Menu} />
          <Route path="/AddItem" component={AddItem} />
          <Route path="/CustomerProfile" component={CustomerProfile} />
          <Route path="/Home" component={GrubhubHome} />
          <Route path="/SearchItem" component={SearchItem} />
          <Route path="/PlaceCustomerOrder" component={PlaceCustomerOrder} />
          <Route exact path="/Cart" component={Cart} />
          <Route exact path="/Checkout" component={Checkout} />
          <Route exact path="/PastOrders" component={PastOrders} />
          <Route exact path="/UpcomingOrders" component={UpcomingOrders} />
          <Route exact path="/ManageOrders" component={ManageOrders} />
        </div>
      </div>
    );
  }
}

export default Main;
