import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Navbar } from "react-bootstrap";
import "./Profile.css";
import { connect } from "react-redux";
import Draggable from "react-draggable";
class UpcomingOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingOrders: [],
      upcomingOrdersAvailable: true
    };
  }
  componentWillMount() {
    if (this.props.loginStateStore.result) {
      var input_email = this.props.loginStateStore.result.email;
      console.log("in component will mount of upcoming orders");
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
          "http://localhost:3001/grubhub/custormer/orders/upcoming",
          data,
          config
        )
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              upcomingOrders: response.data,
              upcomingOrdersAvailable: true
            });
            console.log("upcomingOrders", this.state.upcomingOrders);
            if (this.state.upcomingOrders == []) {
              this.state.upcomingOrdersAvailable = false;
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
    const upcomingOrdersData = this.state.upcomingOrders;
    var dis = true;
    console.log("upcomingorderdata", upcomingOrdersData);
    if (!this.props.loginStateStore.result) {
      redirectVar = <Redirect to="/" />;
    }
    const baseImagePath = "http://localhost:3001/";
    return Object.keys(upcomingOrdersData).map(i => {
      if (
        upcomingOrdersData[i].item_image_name == null ||
        upcomingOrdersData[i].item_image_name == ""
      ) {
        dis = false;
      }
      return (
        <div>
          {redirectVar}
          {this.state.upcomingOrdersAvailable ? (
            <div
              className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing"
              key={upcomingOrdersData[i].ID}
            >
              {/* <a className="pull-left" href="#" target="_parent">
                    <img
                    alt="Thumbnail View of item picture"
                    className="img-responsive uploadImgRest"
                    src={baseImagePath + upcomingOrdersData[i].item_image_name}
                  />
                  </a> */}
              <Draggable
                axis="x"
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                position={null}
                grid={[25, 25]}
                scale={1}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
              >
                <div className="card" style={{ marginBottom: "10px" }}>
                  <div className="card-body">
                    {dis ? (
                      <div className="pull-right">
                        <img
                          alt="Thumbnail View of item picture"
                          className="img-responsive uploadImgItem"
                          src={
                            baseImagePath +
                            upcomingOrdersData[i].item_image_name
                          }
                        />
                      </div>
                    ) : null}
                    <h4 className="card-title">
                      Number of items in this order:{" "}
                      {upcomingOrdersData[i].ordered_items.length}
                    </h4>
                    {/* <h4 className="card-text">
                      Price:{"$"}
                      {parseInt(upcomingOrdersData[i].price) *
                        parseInt(upcomingOrdersData[i].quantity)}
                    </h4>*/}
                    <h4 className="card-text ">
                      Order ID : {upcomingOrdersData[i]._id}
                    </h4>
                    <h4 className="card-text ">
                      Status: {upcomingOrdersData[i].status}
                    </h4>
                    <h4 className="card-text ">
                      Delivered to Address:{" "}
                      {upcomingOrdersData[i].delivery_address}
                    </h4>
                    <h4 className="card-text ">
                      Order last modified on :{" "}
                      {upcomingOrdersData[i].last_modified_on}
                    </h4>
                  </div>
                </div>
              </Draggable>
              {/* <div className="pull-right">
                  <img
                    alt="Thumbnail View of item picture"
                    className="img-responsive uploadImgRest"
                    src={baseImagePath + upcomingOrdersData[i].item_image_name}
                  />
                </div>

                <div className="media-body">
                  <h4 className="myh4">
                    Item Name: {upcomingOrdersData[i].item_name}
                  </h4>
                  <h4 className="myh4">
                    Price:{"$"}
                    {parseInt(upcomingOrdersData[i].price) *
                      parseInt(upcomingOrdersData[i].quantity)}
                  </h4>
                  <h4 className="myh4 ">
                    Quantity: {upcomingOrdersData[i].quantity}
                  </h4>
                  <h4 className="myh4 ">
                    Status: {upcomingOrdersData[i].status}
                  </h4>
                  <h4 className="myh4 ">
                    Delivered to Address:{" "}
                    {upcomingOrdersData[i].delivery_address}
                  </h4>
                  <h4 className="myh4 ">
                    Order last modified on :{" "}
                    {upcomingOrdersData[i].last_modified_on}
                  </h4>
                </div> */}
            </div>
          ) : (
            <div className="container-full">
              <div className="container-pad">
                <h1> No upcoming orders </h1>
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
export default connect(mapStateToProps)(UpcomingOrders);
//export default UpcomingOrders;
