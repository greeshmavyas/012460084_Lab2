import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Navbar } from "react-bootstrap";
import "./Profile.css";
import { connect } from "react-redux";
class PastOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastOrders: [],
      pastOrdersAvailable: true
    };
  }

  componentWillMount() {
    if (this.props.loginStateStore.result) {
      var input_email = this.props.loginStateStore.result.email;
      console.log("in component will mount of past orders");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      axios
        .post(
          "http://localhost:3001/grubhub/custormer/orders/past",
          data,
          config
        )
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              pastOrders: response.data,
              pastOrdersAvailable: true
            });
            console.log("pastOrders", this.state.pastOrders);
            if (this.state.pastOrders.length == 0) {
              this.setState({
                pastOrdersAvailable: false
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error while fetching past orders");
        });
    }
  }
  render() {
    var redirectVar = null;
    const pastOrdersData = this.state.pastOrders;
    console.log("pastOrderData", pastOrdersData);
    var dis = true;
    var itemAvailable = true;
    const baseImagePath = "http://localhost:3001/";
    if (pastOrdersData.length == 0) {
      console.log("im in here");
      itemAvailable = false;
    }
    if (!this.props.loginStateStore.result) {
      redirectVar = <Redirect to="/" />;
    }
    return Object.keys(pastOrdersData).map(i => {
      if (
        pastOrdersData[i].item_image_name == null ||
        pastOrdersData[i].item_image_name == ""
      ) {
        dis = false;
      }
      return (
        <div>
          {redirectVar}
          {itemAvailable ? (
            <div
              className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing"
              key={pastOrdersData[i].ID}
            >
              <div className="card" style={{ marginBottom: "10px" }}>
                <div className="card-body">
                  {dis ? (
                    <div className="pull-right">
                      <img
                        alt="Thumbnail View of item picture"
                        className="img-responsive uploadImgItem"
                        src={baseImagePath + pastOrdersData[i].item_image_name}
                      />
                    </div>
                  ) : null}
                  {/* <h4 className="card-title">
                    Item Name: {pastOrdersData[i].item_name}
                  </h4> */}
                  {/* <h4 className="card-text">
                    Price:{"$"}
                    {parseInt(pastOrdersData[i].price) *
                      parseInt(pastOrdersData[i].quantity)}
                  </h4> */}
                  <h4 className="card-text ">
                    Number of items: {pastOrdersData[i].ordered_items.length}
                  </h4>
                  <h4 className="card-text ">
                    Status: {pastOrdersData[i].status}
                  </h4>
                  <h4 className="card-text ">
                    Order ID: {pastOrdersData[i]._id}
                  </h4>
                  <h4 className="card-text ">
                    Delivered to Address: {pastOrdersData[i].delivery_address}
                  </h4>
                  <h4 className="card-text ">
                    Order last modified on :{" "}
                    {pastOrdersData[i].last_modified_on}
                  </h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="container-full">
              <div className="container-pad">
                <h1> No past orders </h1>
              </div>
            </div>
          )}
        </div>
      );
    });
  }
}
const mapStateToProps = state => ({
  loginStateStore: state.profile,
  profileData: state.info
});

//export default Profile;
export default connect(mapStateToProps)(PastOrders);
