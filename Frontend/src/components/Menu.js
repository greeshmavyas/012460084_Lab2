import React, { Component } from "react";
import "typeface-roboto";
import "./OwnerPropertyListings.css";
import axios from "axios";
import cookie from "react-cookies";
import OwnerProductItem from "./OwnerProductItem";
import { connect } from "react-redux";
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isLoading: true,
      allItems: [],
      detailsFetched: false
    };

    this.logout = this.logout.bind(this);
  }

  logout = () => {
    cookie.remove("cookie1", { path: "/" });
    cookie.remove("cookie2", { path: "/" });
    cookie.remove("cookie3", { path: "/" });
    console.log("All cookies removed!");
    window.location = "/";
  };

  componentWillMount() {
    const data = {
      email: this.props.loginStateStore.result.email
    };
    console.log("In menu component will mount");
    console.log(data);
    var config = {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    };
    axios
      .post(
        "http://localhost:3001/grubhub/owner/getAllItemsByRestId",
        data,
        config
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            allItems: response.data,
            isLoading: false
          });
        }
      });
  }

  renderBreakfastItems() {
    console.log("In render breakfast items");
    const itemData = this.state.allItems;
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
          <OwnerProductItem product={product} key={index} />
        ))}
        <hr />
        <br />
      </div>
    );
  }

  renderLunchItems() {
    console.log("In render lunch items");
    const itemData = this.state.allItems;
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
          <OwnerProductItem product={product} key={index} />
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
    const itemData = this.state.allItems;
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
          <OwnerProductItem product={product} key={index} />
        ))}
        <hr />

        <br />
        <br />
        <br />
      </div>
    );
  }

  render() {
    // let redirectVar = null;
    // console.log(cookie.load("cookie1"));
    // if (cookie.load("cookie1") !== "ownercookie") {
    //   redirectVar = <Redirect to="/owner/login" />;
    // }

    if (this.state.allItems.length === 0) {
      this.state.detailsFetched = false;
    } else {
      this.state.detailsFetched = true;
    }

    return (
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginStateStore: state.profile,
  profileData: state.info,
  itemStore: state.items
});

//export default Profile;
export default connect(mapStateToProps)(Menu);
