import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";
import RenderOrder from "./RenderOrder";
import { connect } from "react-redux";
//Define a Login Component
class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      ordersAvailable: true,
      status: ""
    };
  }

  updateStatus(id) {
    console.log("id passed", id);
  }

  componentWillMount() {
    if (this.props.loginStateStore.result) {
      var input_email = this.props.loginStateStore.result.email;
      console.log("in component will mount of manage orders");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      axios
        .post("http://localhost:3001/grubhub/owner/onlyOrders", data, config)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              orders: response.data,
              ordersAvailable: true
            });
            console.log("orders", this.state.orders);
            if (this.state.orders.length == 0) {
              this.setState({
                ordersAvailable: false
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error while fetching orders");
        });
    }
  }
  render() {
    var redirectVar = null;
    const ordersData = this.state.orders;

    var itemAvailable = true;
    const baseImagePath = "http://localhost:3001/";
    if (ordersData.length == 0) {
      console.log("im in here");
      itemAvailable = false;
    }
    if (!this.props.loginStateStore.result) {
      redirectVar = <Redirect to="/" />;
    }
    return Object.keys(ordersData).map(i => {
      return (
        <div>
          {redirectVar}
          {itemAvailable ? (
            <RenderOrder order={ordersData[i]} />
          ) : (
            <div className="container-full">
              <div className="container-pad">
                <h1> No orders to manage</h1>
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
export default connect(mapStateToProps)(ManageOrders);
