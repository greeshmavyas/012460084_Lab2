import React from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import cookie from "react-cookies";
import { Navbar } from "react-bootstrap";
import { connect } from "react-redux";
class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total: 0,
      deliveryAddress: ""
    };
    this.placeOrder = this.placeOrder.bind(this);
    this.deliveryAddressChangeHandler = this.deliveryAddressChangeHandler.bind(
      this
    );
  }

  componentWillMount() {
    console.log("in will component mount of cart");
    let products = JSON.parse(localStorage.getItem("cartItems"));
    let total = 0;
    if (products.length > 0) {
      for (var i = 0; i < products.length; i++) {
        total +=
          parseInt(products[i].item_price) * parseInt(products[i].quantity);
      }
      this.setState({ products, total });
    }
  }
  deliveryAddressChangeHandler = e => {
    this.setState({
      deliveryAddress: e.target.value
    });
  };
  placeOrder() {
    console.log("in place order");
    var cartItems = [];
    var products = this.state.products;
    for (let i = 0; i < products.length; i++) {
      var item = {
        itemId: products[i].item_id,
        quantity: products[i].quantity
      };
      cartItems.push(item);
    }
    console.log("items" + cartItems);

    var order = {
      restaurantId: this.props.itemStore.item.selectedRestId,
      email: this.props.loginStateStore.result.email,
      deliveryAddress: this.state.deliveryAddress,
      items: cartItems
    };
    console.log("req body of order" + order);
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    var config = {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    };
    axios
      .post("http://localhost:3001/grubhub/custormer/order", order, config)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          alert("Order created successfully");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Issue while placing the order");
      });
  }

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie1"));
    if (this.props.loginStateStore.result.isAuthenticated === false) {
      redirectVar = <Redirect to="/" />;
    }
    const { products, total } = this.state;
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
            </Navbar.Brand>
          </Navbar.Header>
          <div class="row">
            <p className="logo text-center">
              {" "}
              <h5>
                {" "}
                LoggedIn email: {this.props.loginStateStore.result.email}
              </h5>
            </p>
            <a className="logo text-center" href="/CustomerHome">
              <h5>Home </h5>
            </a>

            <a className="logo text-center" href="#" onClick={this.logout}>
              <h5>Logout</h5>
            </a>
          </div>
        </Navbar>
        <br />
        <br />
        <br />

        <div className=" container">
          <br />
          <br />
          <br />
          <br />
          <div class="col-md-6">
            <h3 className="card-title">Checkout</h3>
          </div>
          <hr />
          {products.map((product, index) => (
            <div key={index}>
              <p>
                {product.item_name}
                <small> (quantity: {product.quantity})</small>
                <span className="float-right text-primary">
                  ${parseInt(product.quantity) * parseInt(product.item_price)}
                </span>
              </p>
              <hr />
            </div>
          ))}
          <hr />
          {products.length ? (
            <div>
              <h4>
                <small>Total Amount:</small>
                <span className="float-right text-primary">${total}</span>
              </h4>
              <hr />
            </div>
          ) : (
            ""
          )}
          {!products.length ? (
            <h3 className="text-warning">No item on the cart</h3>
          ) : (
            ""
          )}
          <br />
          <br />
          <br />
          <br />
          <br />
          <div class="form-group">
            <h5>Enter Delivery Address</h5>
            <input
              onChange={this.deliveryAddressChangeHandler}
              type="text"
              class="form-control"
              name="deliveryAddress"
              placeholder="Address Line, Suite Number, City, State, Zip Code"
            />
          </div>
          <br />
          <br />
          <br />

          {products.length ? (
            <Link to="/CustomerHome">
              <button
                className="btn btn-success float-right"
                onClick={this.placeOrder}
              >
                Place Order
              </button>
            </Link>
          ) : (
            ""
          )}
          <Link to="/Cart">
            <button
              className="btn btn-danger float-right"
              style={{ marginRight: "10px" }}
            >
              Cancel
            </button>
          </Link>
          <br />
          <br />
          <br />
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
export default connect(mapStateToProps)(Checkout);
