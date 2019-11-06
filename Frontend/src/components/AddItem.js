import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./AddItem.css";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactUploadItemImage from "./ReactUploadItemImage";
import { addItemByOwner } from "../actions/ownerItemActions";
import { connect } from "react-redux";
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});
const imageMaxSize = 1000000000; // bytes

//Define a AddItem Component
class AddItem extends Component {
  //call the constructor method
  constructor(props) {
    super(props);
    this.state = {
      email: cookie.load("cookie2"),
      itemId: 0,
      itemName: "",
      itemDescription: "",
      price: "",
      section: "",
      restaurantId: "",
      uploadedPhotos: [],
      uploadedPhotoLimit: 1,
      previewuploadedPhotos: [],
      inputPhotos: [],
      alert: null,
      posted: false
    };

    this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
    this.itemDescriptionChangeHandler = this.itemDescriptionChangeHandler.bind(
      this
    );
    this.priceChangeHandler = this.priceChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

    this.onDrop = this.onDrop.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.submitListing = this.submitListing.bind(this);
  }

  itemNameChangeHandler = e => {
    this.setState({ itemName: e.target.value });
  };
  itemDescriptionChangeHandler = e => {
    this.setState({ itemDescription: e.target.value });
  };
  priceChangeHandler = e => {
    this.setState({ price: e.target.value });
  };
  sectionChangeHandler = e => {
    this.setState({ section: e.target.value });
  };

  handleValidation() {
    let formIsValid = true;
    if (!this.state.itemName) {
      formIsValid = false;
      alert("Item name is a Required field");
      console.log("Item name name cannot be empty");
    }

    if (!this.state.price) {
      formIsValid = false;
      alert("Price is a Required field");
      console.log("Price cannot be empty");
    }

    if (!this.state.section) {
      formIsValid = false;
      alert("Section is a Required field");
      console.log("Section cannot be empty");
    }

    return formIsValid;
  }

  submitListing = () => {
    console.log("In submit");
    if (this.handleValidation()) {
      console.log("in setting alert");
      const getAlert = () => (
        <SweetAlert
          success
          title="Congratulations!!"
          onConfirm={() => this.addItem()}
        >
          You successfully listed your item!!!
        </SweetAlert>
      );

      this.setState({
        alert: getAlert()
      });
    }
  };
  resetAlert = e => {
    this.setState({
      alert: ""
    });
  };
  addItem = e => {
    console.log("In Add Property");

    var itemData = {
      email: this.props.loginStateStore.result.email,
      itemName: this.state.itemName,
      price: this.state.price,
      itemDescription: this.state.itemDescription,
      itemSection: this.state.section
    };
    console.log(itemData);
    var config = {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    };
    axios.defaults.withCredentials = true;
    this.props.addItemByOwner(itemData, config);
    console.log("itemstore" + this.props.itemStore);

    this.resetAlert();
  };

  verifyFile = files => {
    if (files) {
      const currentFile = files;
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          "This file is not allowed. " + currentFileSize + " bytes is too large"
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not allowed. Only images are allowed.");
        return false;
      }
      return true;
    }
  };

  onDrop = (selectedFiles, rejectedFiles) => {
    let index;
    for (index = 0; index < selectedFiles.length; ++index) {
      const selectedfile = selectedFiles[index];
      const rejectedfile = rejectedFiles[index];
      if (rejectedfile) {
        this.verifyFile(rejectedfile);
      }

      if (selectedfile) {
        const isVerified = this.verifyFile(selectedfile);
        if (isVerified) {
          if (
            this.state.previewuploadedPhotos.length <
            this.state.uploadedPhotoLimit
          ) {
            this.setState(({ previewuploadedPhotos }) => ({
              previewuploadedPhotos: previewuploadedPhotos.concat(selectedfile)
            }));

            console.log(this.state.selectedfile);

            this.setState({
              uploadedPhotos: this.state.uploadedPhotos.concat(selectedfile)
            });

            console.log(this.state.uploadedPhotos);
          } else {
            console.log(this.state.previewuploadedPhotos.length);
            alert("You can upload only one picture for every item!");
          }
        }
      }
    }
  };

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie1"));
    if (cookie.load("cookie1") != "ownercookie") {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.posted) {
      redirectVar = <Redirect to="/Menu" />;
    }

    return (
      <div>
        {/* {redirectVar} */}
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
                      Item Details
                    </a>
                  </div>
                  <div
                    id="collapseOne"
                    className="collapse show"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="card-body">
                          <div className="card-body border">
                            <div className="form-row ">
                              <div className="form-group col-md-9">
                                <input
                                  id="itemName"
                                  name="itemName"
                                  onChange={this.itemNameChangeHandler}
                                  value={this.state.itemName}
                                  placeholder="Item Name"
                                  className="form-control"
                                  required="required"
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="form-row ">
                              <div className="form-group col-md-3">
                                <input
                                  name="section"
                                  onChange={this.sectionChangeHandler}
                                  value={this.state.section}
                                  placeholder="Section"
                                  className="form-control"
                                  required="required"
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <a
                      className="collapsed card-link"
                      data-toggle="collapse"
                      href="#collapseTwo"
                    >
                      Item Description
                    </a>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <h2>
                        Include the ingredients and other details of the dish
                      </h2>
                      <hr />
                      <div className="container">
                        <div className="row">
                          <div className="col-md-9 border card-body">
                            <form className="form-horizontal">
                              <div className="form-group">
                                <div className="col-xs-8">
                                  <textarea
                                    id="textarea"
                                    placeholder="Item Description"
                                    onChange={this.itemDescriptionChangeHandler}
                                    value={this.state.itemDescription}
                                    name="textarea"
                                    cols="40"
                                    rows="5"
                                    className="form-control"
                                  ></textarea>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <a
                      className="collapsed card-link"
                      data-toggle="collapse"
                      href="#collapseFive"
                    >
                      Step1: Pricing and submit
                    </a>
                  </div>
                  <div
                    id="collapseFive"
                    className="collapse"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3 border card-body">
                          <form className="form-horizontal">
                            <div className="form-group">
                              <h2>Price including taxes($)</h2>
                              <hr />
                              <input
                                type="text"
                                onChange={this.priceChangeHandler}
                                value={this.state.price}
                                className="form-control"
                                id="price"
                                placeholder="Enter value"
                              />
                            </div>
                          </form>
                        </div>
                        <div
                          className="col-md-9 border card-body"
                          style={{ textAlign: "center" }}
                        >
                          <form>
                            <div className="form-row">
                              <div className="form-group">
                                <div className="form-group">
                                  <div className="form-check">
                                    <label
                                      className="form-check-label"
                                      htmlFor="invalidCheck2"
                                    >
                                      <h6>
                                        By clicking Submit, you agree to our
                                        Terms & Conditions, Visitor Agreement
                                        and Privacy Policy.
                                      </h6>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-row">
                              <button
                                type="button"
                                onClick={this.submitListing}
                                className="btn btn-danger"
                              >
                                Submit
                              </button>
                              {this.state.alert}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <a
                      className="collapsed card-link"
                      data-toggle="collapse"
                      href="#collapseFour"
                    >
                      Step 2: Picture of the item
                    </a>
                  </div>
                  <div
                    id="collapseFour"
                    className="collapse"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <h2>Add photo of your item</h2>
                      <hr />
                      <ReactUploadItemImage {...this.state} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export Login Component

const mapStateToProps = state => ({
  loginStateStore: state.profile,
  profileData: state.info,
  itemStore: state.items
});

//export default Profile;
export default connect(
  mapStateToProps,
  { addItemByOwner }
)(AddItem);
//export AddItem Component
// export default AddItem;
