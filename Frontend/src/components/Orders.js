import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";
import OrderItem from "./OrderItem";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//Define a Login Component
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      ordersAvailable: false
    };

    this.renderOrdersInProgress = this.renderOrdersInProgress.bind(this);
    this.renderOldOrders = this.renderOldOrders.bind(this);
  }
  renderOrdersInProgress() {
    console.log("In render orders in progress");
    const ordersData = this.state.orders;
    console.log(ordersData);
    var ordersNew = ordersData.filter(function(each) {
      return each.status == "New";
    });
    var ordersPreparing = ordersData.filter(function(each) {
      return each.status == "Preparing";
    });
    var ordersReady = ordersData.filter(function(each) {
      return each.status == "Ready";
    });
    console.log("order", ordersNew, ordersPreparing, ordersReady);
    var ordersInProgress = [];

    ordersInProgress = ordersNew.concat(ordersPreparing, ordersReady);
    console.log("Orders in progress", ordersInProgress);
    return (
      <div>
           
        {ordersInProgress.map((order, index) => (
          <OrderItem order={order} key={index} />
        ))}
              
      </div>
    );
  }
  renderOldOrders() {
    console.log("In render orders in progress");
    const ordersData = this.state.orders;
    console.log(ordersData);
    var ordersDelivered = ordersData.filter(function(each) {
      return each.status == "delivered";
    });
    var ordersCanceled = ordersData.filter(function(each) {
      return each.status == "canceled";
    });

    console.log("order", ordersDelivered, ordersCanceled);
    var pastOrders = [];

    pastOrders = ordersDelivered.concat(ordersCanceled);
    console.log("Orders in progress", pastOrders);
    return (
      <div>
           
        {pastOrders.map((order, index) => (
          <OrderItem order={order} key={index} />
        ))}
              
      </div>
    );
  }

  componentWillMount() {
    if (this.props.loginStateStore.result) {
      var input_email = this.props.loginStateStore.result;
      console.log("in component will mount of past orders");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:3001/grubhub/owner/orders", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              orders: response.data,
              ordersAvailable: true
            });
            if (this.state.orders == []) {
              this.state.ordersAvailable = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error while fetching orders");
        });
    }
  }

  render() {
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
                                  Orders in Progress             
                  </a>
                  <h5 className="card-title">List of ordered items</h5>{" "}
                            
                </div>
                          
                <div
                  id="collapseOne"
                  className="collapse show"
                  data-parent="#accordion"
                >
                              <div> {this.renderOrdersInProgress()}</div>{" "}
                            
                </div>
                        
              </div>
               
              <div className="card">
                          
                <div className="card-header">
                              
                  <a
                    className="card-link"
                    data-toggle="collapse"
                    href="#collapseOne"
                  >
                                  Past Orders             
                  </a>
                   {" "}
                  <h5 className="card-title">
                    List of items canceled or delivered
                  </h5>{" "}
                            
                </div>
                          
                <div
                  id="collapseOne"
                  className="collapse show"
                  data-parent="#accordion"
                >
                              <div> {this.renderOldOrders()}</div>
                            
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
  profileData: state.info
});

//export default Profile;
export default connect(mapStateToProps)(Orders);
