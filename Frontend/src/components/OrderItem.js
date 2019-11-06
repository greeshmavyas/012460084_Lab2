import React from "react";
import "./Profile.css";
export default class OrderItem extends React.Component {
  constructor(props) {
    super(props);
  }

  handleInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    console.log("prod item render");
    const { order } = this.props;
    var dis = true;
    const baseImagePath = "http://localhost:3001/";
    if (order.item_image_name == null || order.item_image_name == "") {
      dis = false;
    }
    return (
      <div className="card" style={{ marginBottom: "10px" }}>
        <div className="card-body">
                  
          {dis ? (
            <div className="pull-right">
                          
              <img
                alt="Thumbnail View of restaurant picture"
                className="img-responsive uploadImgRest"
                src={baseImagePath + order.item_image_name}
              />
                        
            </div>
          ) : null}
          <h4 className="card-title">Order ID: {order.order_id}</h4>
          <h5 className="card-text">Ordered person's email: {order.email}</h5>
          <h5 className="card-text">Item Name: {order.item_name}</h5>
          <h5 className="card-text">
            Delivery Address: {order.delivery_address}
          </h5>
          <h5 className="card-text">Restaurant ID: {order.restaurant_id}</h5>
          <h5 className="card-text">Status: {order.status}</h5>
          <h5 className="card-text">Quantity: {order.quantity}</h5>
          <h5 className="card-text">price: ${order.price}</h5>
        </div>
      </div>
    );
  }
}
