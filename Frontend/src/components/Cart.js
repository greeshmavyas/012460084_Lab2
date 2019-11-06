import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { Redirect } from "react-router";
import CartItem from "./CartItem";
import cookie from "react-cookies";
import { connect } from "react-redux";
class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total: 0
    };
  }

  componentWillMount() {
    console.log("in will component mount of cart");
    let products = JSON.parse(localStorage.getItem("cartItems"));

    if (!products) return;
    if (products.length > 0) {
      let total = 0;
      console.log(products.length);
      for (var i = 0; i < products.length; i++) {
        total +=
          parseInt(products[i].item_price) * parseInt(products[i].quantity);
      }
      this.setState({ products, total });
    }
  }

  removeFromCart = product => {
    let products = this.state.products.filter(
      item => item.item_id !== product.item_id
    );
    localStorage.removeItem("cartItems");
    localStorage.setItem("cartItems", JSON.stringify(products));
    let qty = parseInt(product.quantity);
    let price = parseInt(product.item_price);

    let total = this.state.total - qty * price;
    this.setState({ products, total });
  };

  clearCart = () => {
    localStorage.removeItem("cartItems");
    this.setState({ products: [], total: 0 });
  };

  render() {
    let redirectVar = null;
    if (this.props.loginStateStore.result.isAuthenticated === false) {
      redirectVar = <Redirect to="/" />;
    }
    console.log("in cart render");
    const { products, total } = this.state;
    console.log("products" + products);
    console.log("total" + total);
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
        <div className=" container">
          <h3 className="card-title">Cart</h3>
          <hr />
          {products.map((product, index) => (
            <CartItem
              product={product}
              remove={this.removeFromCart}
              key={index}
            />
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
          <Link to="/checkout">
            <button className="btn btn-success float-right">Checkout</button>
          </Link>
          <button
            className="btn btn-danger float-right"
            onClick={this.clearCart}
            style={{ marginRight: "10px" }}
          >
            Clear Cart
          </button>
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
export default connect(mapStateToProps)(Cart);
