import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";
import PlaceCustomerOrder from "./PlaceCustomerOrder";
import { connect } from "react-redux";
import { selectRestaurant } from "../actions/ownerItemActions";
//Define a Login Component
class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      cuisine: "",
      query: "",
      data: [],
      isLoading: true,
      searchData: [{}],
      detailsFetched: true,
      isCustomerLoggedIn: false,
      redirectTorestInfo: null
    };

    this.itemNameChangeChangeHandler = this.itemNameChangeChangeHandler.bind(
      this
    );
    this.cuisineChangeHandler = this.cuisineChangeHandler.bind(this);
    this.searchRestaurantsForItem = this.searchRestaurantsForItem.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.renderPlaceCustomerOrder = this.renderPlaceCustomerOrder.bind(this);
  }

  renderPlaceCustomerOrder(event, restIDVal) {
    console.log("ihuheh" + restIDVal);
    this.setState({
      redirectTorestInfo: <Redirect to="/PlaceCustomerOrder" />
    });
    // let path = `/PlaceCustomerOrder?restID=` + restIDVal;
    // this.props.history.push(path);
    this.props.selectRestaurant(restIDVal);
  }

  searchRestaurantsForItem() {
    var enteredCuisine = this.state.cuisine;
    console.log("dfsfsfasfsdf", enteredCuisine);

    if (this.handleValidation()) {
      const data = {
        itemName: this.state.itemName,
        email: this.props.loginStateStore.result.email
      };
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      console.log("Calling item Search in search Restaurants for item");
      console.log(data);
      axios
        .post(
          "http://localhost:3001/grubhub/customer/getRestaurantsByItemName",
          data,
          config
        )
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log(response.data);

            this.setState({
              searchData: response.data,
              isLoading: false,
              detailsFetched: true
            });
            if (!(enteredCuisine == "")) {
              var searchData = response.data.filter(function(each) {
                return each.cuisine == enteredCuisine;
              });
              if (searchData.length > 0) {
                this.setState({
                  searchData: searchData,
                  isLoading: false,
                  detailsFetched: true
                });
              } else {
                this.setState({ detailsFetched: false });
              }
            } else {
              if (!(response.data.length > 0))
                this.setState({ detailsFetched: false });
            }
            console.log("myres message" + response.data.responseMessage);
            if (response.data.responseMessage == "Item not available") {
              console.log("im in response check");
              this.setState({ detailsFetched: false });
              console.log("details fetched : " + this.detailsFetched);
            }
          }
        });
    }
  }

  itemNameChangeChangeHandler = e => {
    this.setState({
      itemName: e.target.value
    });
  };
  cuisineChangeHandler = e => {
    this.setState({
      cuisine: e.target.value
    });
  };

  handleValidation() {
    let formIsValid = true;
    if (!this.state.itemName) {
      formIsValid = false;
      alert("Item Name is a Required field");
      console.log("Search LOcation cannot be empty");
    }
    console.log("is valid?" + formIsValid);
    return formIsValid;
  }
  renderSearchResults() {
    var redirectVar = null;
    const { searchData } = this.state;
    const { isLoading } = this.state;
    if (this.props.loginStateStore.result.isAuthenticated === false) {
      redirectVar = <Redirect to="/" />;
    }
    console.log("serachdata" + JSON.stringify(searchData));
    const baseImagePath = "http://localhost:3001/";
    console.log(this.state.detailsFetched);
    //var restIDVal;
    if (!isLoading) {
      console.log("generating content...");
      console.log(JSON.stringify(searchData));
      return Object.keys(searchData).map(i => {
        let restIDVal = searchData[i]._id;
        console.log("restIDVal", restIDVal);
        return (
          <div>
            {redirectVar}
            {this.state.detailsFetched ? (
              <div
                className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing"
                key={searchData[i].ID}
              >
                <div className="media">
                  <a className="pull-left" href="#" target="_parent">
                    <img
                      alt="Thumbnail View of restaurant image"
                      className="img-responsive"
                      src={baseImagePath + searchData[i].rest_image_name}
                    />
                  </a>
                  <div className="media-body">
                    <h4 className="myh4">Restaurant ID: {searchData[i]._id}</h4>
                    <h4 className="myh4">Cusine: {searchData[i].cuisine}</h4>
                    <h4 className="myh4 ">
                      owner email: {searchData[i].email}
                    </h4>
                    <a
                      name="restId"
                      href="#"
                      onClick={event => {
                        this.renderPlaceCustomerOrder(event, searchData[i]._id);
                      }}
                    >
                      {" "}
                      <h4 className="myh4 ">
                        {searchData[i].restaurant_name}
                      </h4>{" "}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container-full">
                <div className="container-pad">
                  <h1>
                    {" "}
                    The item or the cuisine you requested is not available{" "}
                  </h1>
                </div>
              </div>
            )}
          </div>
        );
      });
    }
  }

  render() {
    console.log("redirectTorestInfo" + this.state.redirectTorestInfo);
    return (
      <div>
        {this.state.redirectTorestInfo}
        <div className="row">
          <div className="col-md-4 col-md-offset-3">
            <div className="form-group">
              <input
                type="text"
                style={{
                  height: "60px",
                  fontFamily:
                    "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"
                }}
                className="form-control"
                name="search"
                id="search"
                placeholder="Search with an item name?"
                onChange={this.itemNameChangeChangeHandler}
              />
              <input
                type="text"
                style={{
                  height: "60px",
                  fontFamily:
                    "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"
                }}
                className="form-control"
                name="searchByCuisine"
                id="searchByCuisine"
                placeholder="Enter the cuisine (Optional)"
                onChange={this.cuisineChangeHandler}
              />
              <span className="glyphicon glyphicon-search form-control-feedback"></span>
            </div>
          </div>
          <br />
          <br />
          <div className="col-md-offset-3" style={{ marginLeft: "15px" }}>
            <div className="form-group">
              <button
                className="btn btn-primary"
                onClick={this.searchRestaurantsForItem}
                style={{
                  height: "60px",
                  borderColor: "#ffffff",
                  backgroundColor: "#0067db",
                  width: "120px",
                  borderRadius: 25
                }}
                data-effect="ripple"
                type="button"
                tabIndex="5"
                data-loading-animation="true"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div> {this.renderSearchResults()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginStateStore: state.profile
});

//export default Profile;
export default connect(
  mapStateToProps,
  { selectRestaurant }
)(SearchItem);
