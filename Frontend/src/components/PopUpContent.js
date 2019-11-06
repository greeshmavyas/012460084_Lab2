import React from "react";
import "./Profile.css";
import "./Popup.css";

export default class PopUpContent extends React.Component {
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

  // editItem() {}

  render() {
    return (
      <div class="container">
        <div class="form-group">
          <input
            onChange={this.itemNameChangeHandler}
            type="text"
            ref="myfirstname"
            class="form-control"
            name="itemname"
            placeholder="Item name"
          />
        </div>
        <div class="form-group">
          <input
            onChange={this.itemDescriptionChangeHandler}
            type="text"
            class="form-control"
            name="itemdescription"
            placeholder="item description"
          />
        </div>
        <div class="form-group">
          <input
            onChange={this.priceChangeHandler}
            type="text"
            class="form-control"
            name="price"
            placeholder="price"
          />
        </div>
        <div>
          <button
            onClick={this.editItem}
            class="btn btn-primary"
            style={{ width: "100%" }}
          >
            Update Item Info
          </button>
        </div>
      </div>
    );
  }
}
