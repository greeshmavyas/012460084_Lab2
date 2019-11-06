import React from "react";

export default class ProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      cartItems: []
    };
  }

  handleInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  addToCart = () => {
    let cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    let id = this.props.product._id;
    let quantityUpdate = false;
    for (let i = 0; i < cartItems.length; i++) {
      if (id == cartItems[i].item_id) {
        cartItems[i].quantity =
          parseInt(cartItems[i].quantity) + parseInt(this.state.quantity);
        quantityUpdate = true;
        break;
      }
    }
    if (!quantityUpdate) {
      var cartItem = {
        item_id: this.props.product._id,
        item_price: this.props.product.price,
        item_description: this.props.product.item_description,
        item_name: this.props.product.item_name,
        section: this.props.product.section,
        restaurant_id: this.props.product.restaurant_Id,
        quantity: this.state.quantity
      };
      cartItems.push(cartItem);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  render() {
    console.log("prod item render");
    const { product } = this.props;
    var dis = true;
    const baseImagePath = "http://localhost:3001/";
    if (product.item_image_name == null || product.item_image_name == "") {
      dis = false;
    }
    return (
      <div className="card" style={{ marginBottom: "10px" }}>
        <div className="card-body">
          {dis ? (
            <div className="pull-right">
              <img
                alt="Thumbnail View of restaurant picture"
                className="img-responsive uploadImgRest"
                src={baseImagePath + product.item_image_name}
              />
            </div>
          ) : null}
          <h4 className="card-title">{product.item_name}</h4>
          <p className="card-text">{product.item_description}</p>
          <h5 className="card-text">
            <small>price: </small>${product.price}
          </h5>

          <div>
            <button
              className="btn btn-sm btn-warning float-right"
              onClick={this.addToCart}
            >
              Add to cart
            </button>
            <input
              type="number"
              value={this.state.quantity}
              name="quantity"
              onChange={this.handleInputChange}
              className="float-right"
              style={{
                width: "60px",
                marginRight: "10px",
                borderRadius: "3px"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
