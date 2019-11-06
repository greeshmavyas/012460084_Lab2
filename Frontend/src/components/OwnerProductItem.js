import React from "react";
import "./Profile.css";
import "./Popup.css";
import axios from "axios";
import Popup from "reactjs-popup";
import PopUpContent from "./PopUpContent";

const Modal = () => (
  <Popup
    trigger={
      <button className="btn btn-sm btn-warning float-right">
        {" "}
        Edit Item{" "}
      </button>
    }
    modal
    closeOnDocumentClick
  >
    <span>
      {" "}
      <PopUpContent />{" "}
    </span>
  </Popup>
);

export default class OwnerProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      itemDescription: "",
      price: ""
    };

    this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
    this.itemDescriptionChangeHandler = this.itemDescriptionChangeHandler.bind(
      this
    );
    this.priceChangeHandler = this.priceChangeHandler.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  itemNameChangeHandler = e => {
    this.setState({
      itemName: e.target.value
    });
  };
  itemDescriptionChangeHandler = e => {
    this.setState({
      itemDescription: e.target.value
    });
  };
  priceChangeHandler = e => {
    this.setState({
      price: e.target.value
    });
  };

  deleteItem() {
    const data = {
      itemId: this.props.product.item_id
    };
    axios
      .post("http://localhost:3001/grubhub/owner/menu/delete", data)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data.responseMessage);
          alert(response.data.responseMessage);
          window.location.replace("/OwnerHome");
        } else {
          alert(response.data.responseMessage);
          console.log(response.data.responseMessage);
          window.location.replace("/OwnerHome");
        }
      });
  }

  render() {
    const { product } = this.props;
    console.log("prod item render");
    var dis = true;
    const baseImagePath = "http://localhost:3001/";
    if (product.item_image_name == null || product.item_image_name == "") {
      dis = false;
    }

    return (
      <div class="container">
        <div className="card" style={{ marginBottom: "10px" }}>
          <div className="card-body">
            {dis ? (
              <div className="pull-right">
                <img
                  alt="Thumbnail View of restaurant picture"
                  className="img-responsive "
                  src={baseImagePath + product.item_image_name}
                />
              </div>
            ) : null}
            <div>
              <h4 className="card-title">{product.item_name}</h4>
              <h5 className="card-text">
                Item Description: {product.item_description}
              </h5>
              <h5 className="card-text">Price: ${product.price}</h5>
              <h5 className="card-text">item_id: ${product.item_id}</h5>
              <div>
                <Modal product={product} />

                <button
                  className="btn btn-sm btn-danger float-right"
                  onClick={this.deleteItem}
                >
                  Delete item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
