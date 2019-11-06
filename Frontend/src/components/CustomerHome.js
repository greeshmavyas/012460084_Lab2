import React, { Component } from "react";
import CustomerProfile from "./CustomerProfile";
import SearchItem from "./SearchItem";
import PastOrders from "./PastOrders";
import UpcomingOrders from "./UpcomingOrders";
import cookie from "react-cookies";
import { Navbar } from "react-bootstrap";
import "./Profile.css";
import "./sideBarMenu.css";
import { Redirect } from "react-router";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { logout } from "../actions/profileActions";

//Define a Login Component

const MenuComponent = ({ onClick }) => {
  return (
    <div class="sidebar mytext">
      <div class="mytext"> Your Account</div>

      <a onClick={onClick} name="Profile" href="#">
        Profile
      </a>
      <a onClick={onClick} name="SearchItem" href="#">
        Search
      </a>

      <a onClick={onClick} name="PastOrders" href="#">
        Past Orders
      </a>
      <a onClick={onClick} name="UpcomingOrders" href="#">
        Upcoming Orders
      </a>
    </div>
  );
};
class CustomerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: cookie.load("cookie2"),
      component: ""
    };
    this.logout = this.logout.bind(this);
    this.selectComponent = this.selectComponent.bind(this);
  }
  selectComponent(event) {
    event.persist();
    // this will take the name of the <a> thats beeing clicked and sets name of <a> to state
    event.preventDefault();
    console.log(event);
    console.log("in select component" + event.target.name);
    this.setState({ component: event.target.name });
  }
  logout = () => {
    localStorage.clear();
    this.props.logout();
    console.log("All cookies removed!");
    window.location = "/";
  };
  render() {
    let toRender = null;
    console.log(toRender);
    console.log("the state is whattt" + this.state.component);
    switch (this.state.component) {
      case "Profile":
        toRender = <CustomerProfile />;
        break;

      case "SearchItem":
        console.log("in search");
        toRender = <SearchItem />;
        break;

      case "PastOrders":
        console.log("in menu");
        toRender = <PastOrders />;
        break;

      case "UpcomingOrders":
        toRender = <UpcomingOrders />;
        break;

      default:
        console.log("in menu");
        toRender = (
          <div>
            {" "}
            <img
              className="homeimg"
              src={require("./images/burger.png")}
              alt="burger"
            />
          </div>
        );
        break;
    }
    let redirectVar = null;
    let email = "";
    if (
      !this.props.loginStateStore.result ||
      this.props.loginStateStore.result.isAuthenticated === false ||
      this.props.loginStateStore.result.ownerOrBuyer != "customercookie"
    ) {
      redirectVar = <Redirect to="/" />;
    } else {
      email = this.props.loginStateStore.result.email;
    }

    return (
      <div>
        {redirectVar}
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/" title="GrubHub" className="logo">
                <img
                  className="logo"
                  src={require("./images/GrubHubBW.png")}
                  alt="GrubHub Logo"
                />
              </a>

              <div className="btn btn-group">
                <button
                  style={{
                    backgroundColor: "transparent",
                    background: "transparent",
                    borderColor: "transparent"
                  }}
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                ></button>
              </div>
            </Navbar.Brand>
          </Navbar.Header>
          <div class="row">
            <p className="logo text-center">
              {" "}
              <h5> LoggedIn email: {email}</h5>
            </p>

            <a className="logo text-center" href="#" onClick={this.logout}>
              <h5>Logout</h5>
            </a>
          </div>
        </Navbar>

        <MenuComponent onClick={this.selectComponent} />
        <div className="main">{toRender}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginStateStore: state.profile
});

//export default Profile;
export default connect(
  mapStateToProps,
  { logout }
)(CustomerHome);
