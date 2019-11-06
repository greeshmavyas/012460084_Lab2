import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Navbar } from "react-bootstrap";
import { Redirect } from "react-router";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { selectRestaurant } from "../actions/ownerItemActions";
//Define a Login Component
class PlaceCustomerOrder extends Component {
  constructor(props) {
    super(props);

    var restIDFromURL = new URL(window.location.href);
    var restIDValue = restIDFromURL.searchParams.get("restID");
    this.state = {
      restaurantId: restIDValue,
      itemData: []
    };
    this.logout = this.logout.bind(this);
    this.renderBreakfastItems = this.renderBreakfastItems.bind(this);
    this.renderLunchItems = this.renderLunchItems.bind(this);
    this.renderAppetizerItems = this.renderAppetizerItems.bind(this);
  }
  componentWillMount() {
    if (this.props.loginStateStore.result.email) {
      console.log("in component will mount of place order");
      const data = { restaurantId: this.props.itemStore.item.selectedRestId };
      axios.defaults.withCredentials = true;
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      axios
        .post(
          "http://localhost:3001/grubhub/customer/getAllItemsByRestId",
          data,
          config
        )
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              itemData: response.data
            });
            console.log("***" + JSON.stringify(this.state.itemData));
            console.log(this.state.profiledata);
            console.log(this.state.profiledata[0].firstname);
            this.refs.itemname.value = this.state.profiledata[0].item_name;
            this.state.itemname = this.state.profiledata[0].first_name;
            this.refs.price.value = this.state.profiledata[0].price;
            this.state.price = this.state.profiledata[0].price;
            this.refs.itemdescription.value = this.state.profiledata[0].item_description;
            this.state.itemdescription = this.state.profiledata[0].item_description;
            this.refs.section.value = this.state.profiledata[0].section;
            this.state.section = this.state.profiledata[0].section;
          }
        })
        .catch(err => {
          console.log(err);

          this.setState({
            authFlag: false
          });
        });
    }

    console.log("event" + this.props.restaurantId);
  }

  logout = () => {
    cookie.remove("cookie1", { path: "/" });
    cookie.remove("cookie2", { path: "/" });
    cookie.remove("cookie3", { path: "/" });
    console.log("All cookies removed!");
    window.location = "/";
  };

  renderBreakfastItems() {
    console.log("In render breakfast items");
    const { itemData } = this.state;
    console.log(itemData);
    var breakfastItems = itemData.filter(function(each) {
      return each.section == "breakfast";
    });
    console.log(breakfastItems);
    return (
      <div className=" container">
        <h3 className="card-title">List of Available Products</h3>
        <hr />
        {breakfastItems.map((product, index) => (
          <ProductItem product={product} key={index} />
        ))}
        <hr />
        <br />
      </div>
    );
  }

  renderLunchItems() {
    console.log("In render lunch items");
    const { itemData } = this.state;
    console.log(itemData);
    var lunchItems = itemData.filter(function(each) {
      return each.section == "lunch";
    });
    console.log(lunchItems);
    return (
      <div className=" container">
        <h3 className="card-title">List of Available Products</h3>
        <hr />
        {lunchItems.map((product, index) => (
          <ProductItem product={product} key={index} />
        ))}
        <hr />

        <br />
        <br />
        <br />
      </div>
    );
  }
  renderAppetizerItems() {
    console.log("In render lunch items");
    const { itemData } = this.state;
    console.log(itemData);
    var appetizerItems = itemData.filter(function(each) {
      return each.section == "Snacks";
    });
    console.log(appetizerItems);
    return (
      <div className=" container">
        <h3 className="card-title">List of Available Products</h3>
        <hr />
        {appetizerItems.map((product, index) => (
          <ProductItem product={product} key={index} />
        ))}
        <hr />

        <br />
        <br />
        <br />
      </div>
    );
  }

  render() {
    let redirectVar = null;

    if (this.props.loginStateStore.result.isAuthenticated === false) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
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
              <h5> LoggedIn email: {cookie.load("cookie2")}</h5>
            </p>
            <a className="logo text-center" href="/CustomerHome">
              <h5>Home </h5>
            </a>
            <a className="logo text-center" href="#" onClick={this.logout}>
              <h5>Logout</h5>
            </a>
          </div>
        </Navbar>
        {redirectVar}
        <div
          className="container"
          style={{
            fontFamily: "Lato,Arial,Helvetica Neue,sans-serif",
            marginTop: "50px"
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <div id="accordion">
                <div className="card">
                  <div className="card-header">
                    <a
                      className="card-link"
                      data-toggle="collapse"
                      href="#collapseOne"
                    >
                      Breakfast
                    </a>
                  </div>
                  <div
                    id="collapseOne"
                    className="collapse show"
                    data-parent="#accordion"
                  >
                    <div> {this.renderBreakfastItems()}</div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="collapsed card-link"
                      data-toggle="collapse"
                      href="#collapseFour"
                    >
                      Lunch
                    </a>
                  </div>
                  <div> {this.renderLunchItems()}</div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <a
                      className="collapsed card-link"
                      data-toggle="collapse"
                      href="#collapseFive"
                    >
                      Snacks
                    </a>
                  </div>
                  <div> {this.renderAppetizerItems()}</div>
                </div>
                <div className="form-row">
                  <Link to="/Checkout">
                    <button className="btn btn-success float-right">
                      Checkout
                    </button>
                  </Link>
                  <Link to="/Cart">
                    <button
                      className="btn btn-primary float-right"
                      style={{ marginRight: "10px" }}
                    >
                      View Cart
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  loginStateStore: state.profile,
  itemStore: state.items
});

//export default Profile;
export default connect(
  mapStateToProps,
  { selectRestaurant }
)(PlaceCustomerOrder);
