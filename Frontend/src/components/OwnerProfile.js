import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./Profile.css";
import ReactUploadImageForOwnerPage from "./ReactUploadImageForOwnerPage";
import ReactUploadRestImage from "./ReactUploadRestImage";
import { connect } from "react-redux";
import {
  ownerProfileFetch,
  ownerProfileSave,
  lastnameChangeHandler,
  firstnameChangeHandler,
  phonenumberChangeHandler,
  rnameChangeHandler,
  cuisineChangeHandler,
  zipcodeChangeHandler
} from "../actions/profileFetchActions";

//Define a OwnerProfile Component
class OwnerProfile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      profiledata: [],
      profileImagePath: "",
      restImagePath: ""
    };

    //Bind the handlers to this class
    // this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    // this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    // this.rnameChangeHandler = this.rnameChangeHandler.bind(this);
    // this.cuisineChangeHandler = this.cuisineChangeHandler.bind(this);
    // this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    //this.handleValidation = this.handleValidation.bind(this);
    this.readFileName = this.readFileName.bind(this);
    this.readRestFileName = this.readRestFileName.bind(this);
  }

  readFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ profileImagePath: fileName });
  }

  readRestFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ restImagePath: fileName });
  }

  logout = () => {
    cookie.remove("cookie1", { path: "/" });
    cookie.remove("cookie2", { path: "/" });
    cookie.remove("cookie3", { path: "/" });
    console.log("All cookies removed!");
    window.location = "/";
  };

  componentDidUpdate() {
    //this.setState({ profiledata: this.props.profileData.result });
    console.log("i am setting the state here" + JSON.stringify(this.state));
    this.refs.myfirstname.value = this.props.profileData.result.first_name;

    this.refs.mylastname.value = this.props.profileData.result.last_name;

    this.refs.phone.value = this.props.profileData.result.phone_number;
    this.refs.cuisine.value = this.props.profileData.result.cuisine;

    this.refs.rname.value = this.props.profileData.result.rname;

    this.refs.zipcode.value = this.props.profileData.result.zip_code;

    //this.refs.email.value = this.props.profileData.result.email;
    this.state.profileImagePath = this.props.profileData.result.image_name;
  }

  componentWillMount() {
    if (this.props.loginStateStore.result.email) {
      var input_email = this.props.loginStateStore.result.email;
      console.log("in component will mount of customer profile");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      this.props.ownerProfileFetch(data, config);
    }
  }

  firstnameChangeHandler = e => {
    this.props.firstnameChangeHandler(e);
  };

  lastnameChangeHandler = e => {
    this.props.lastnameChangeHandler(e);
  };

  rnameChangeHandler = e => {
    this.props.rnameChangeHandler(e);
  };

  phoneChangeHandler = e => {
    this.props.phonenumberChangeHandler(e);
  };

  zipCodeChangeHandler = e => {
    this.props.zipcodeChangeHandler(e);
  };

  cuisineChangeHandler = e => {
    this.props.cuisineChangeHandler(e);
  };

  //submit Login handler to send a request to the node backend
  saveChanges(event) {
    console.log("Inside save form");
    //prevent page from refresh
    event.preventDefault();
    let formIsValid = true;

    //firstname
    if (!this.props.profileData.result.first_name) {
      formIsValid = false;
      alert("First Name is a Required field");
      console.log("First name cannot be empty");
    }

    //lastname
    if (!this.props.profileData.result.last_name) {
      formIsValid = false;
      alert("Last Name is a Required field");
      console.log("Last name cannot be empty");
    }

    //Restaurant
    if (!this.props.profileData.result.rname) {
      formIsValid = false;
      alert("restaurant name is a Required field");
      console.log("restaurant name cannot be empty");
    }
    //Zip Code
    if (!this.props.profileData.result.zip_code) {
      formIsValid = false;
      alert("Zip Code is a Required field");
      console.log("Zip Code cannot be empty");
    }
    //Cusisine
    if (!this.props.profileData.result.cuisine) {
      formIsValid = false;
      alert("Cuisine is a Required field");
      console.log("Cuisine cannot be empty");
    }

    if (formIsValid) {
      console.log("Profile Form data submitted");
      var input_email = this.props.loginStateStore.result.email;
      console.log(input_email);
      const data = {
        firstname: this.props.profileData.result.first_name,
        lastname: this.props.profileData.result.last_name,
        phone: this.props.profileData.result.phone_number,
        email: input_email,
        rname: this.props.profileData.result.rname,
        cuisine: this.props.profileData.result.cuisine,
        zipcode: this.props.profileData.result.zip_code
      };
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      axios.defaults.withCredentials = true;
      this.props.ownerProfileSave(data, config);
    }
  }

  render() {
    //redirect based on successful login
    let redirectVar = null;
    var dis = true;
    var restDis = true;
    const baseImagePath = "http://localhost:3001/";
    console.log("new image path", this.state.profileImagePath);
    if (
      this.state.profileImagePath == "" ||
      this.state.profileImagePath == null
    ) {
      dis = false;
    }
    if (this.state.restImagePath == "" || this.state.restImagePath == null) {
      restDis = false;
    }
    if (
      !this.props.loginStateStore.result ||
      this.props.loginStateStore.result.isAuthenticated === false ||
      this.props.loginStateStore.result.ownerOrBuyer != "ownercookie"
    ) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <p></p>
        </div>
        <div class="uploadImg">
          <ReactUploadImageForOwnerPage readFileName={this.readFileName} />
        </div>

        {/* <div style={{ height: "300px" }}></div> */}

        <div class="uploadImgRest">
          <ReactUploadRestImage readRestFileName={this.readRestFileName} />
          {dis ? (
            <div className="pull-right">
              <img
                alt="Thumbnail View of restaurant picture"
                className="img-responsive profilepic"
                style={{ marginLeft: "20%" }}
                src={baseImagePath + this.state.restImagePath}
              />
            </div>
          ) : null}
        </div>

        <div id="profilehref" class="myprofilecontainer">
          <div class="login-form">
            <h2>Account Information</h2>
            <br></br>
            {dis ? (
              <div className="pull-right">
                <img
                  alt="Thumbnail View of Profile picture"
                  className="img-responsive profilepic"
                  src={baseImagePath + this.state.profileImagePath}
                />
              </div>
            ) : null}
            <div class="form-group">
              <p>First Name </p>
              <input
                ref="myfirstname"
                onChange={this.firstnameChangeHandler}
                type="text"
                class="form-control"
                name="firstname"
                placeholder="First Name"
                required
              />
            </div>
            <div class="form-group">
              <p>Last Name </p>
              <input
                ref="mylastname"
                onChange={this.lastnameChangeHandler}
                type="text"
                class="form-control"
                name="lastname"
                placeholder="Last Name or Initial"
                required
              />
            </div>

            <div class="form-group">
              <p>Phone </p>
              <input
                ref="phone"
                onChange={this.phoneChangeHandler}
                type="text"
                class="form-control"
                name="phone"
                placeholder="Phone Number"
                required
              />
            </div>

            <div class="form-group">
              <p>Restaurant Name </p>
              <input
                ref="rname"
                onChange={this.rnameChangeHandler}
                type="text"
                class="form-control"
                name="rname"
                placeholder="Restaurant Name"
                required
              />
            </div>

            <div class="form-group">
              <p>Cuisine </p>
              <input
                ref="cuisine"
                onChange={this.cuisineChangeHandler}
                type="text"
                class="form-control"
                name="cuisine"
                placeholder="Cuisine"
                required
              />
            </div>

            <div class="form-group">
              <p>Zip Code </p>
              <input
                ref="zipcode"
                onChange={this.zipCodeChangeHandler}
                type="text"
                pattern="[0-9]{5}"
                class="form-control"
                name="zipcode"
                placeholder="Zip Code"
                required
              />
            </div>
            <div class="form-group">
              <p>Email: </p>

              <h4>{this.props.loginStateStore.result.email}</h4>
            </div>
          </div>
        </div>
        <br></br>

        <div class="col-md-10 text-center">
          <button onClick={this.saveChanges} class="btn-primary btn-lg">
            Save Changes
          </button>
        </div>
        <br />
      </div>
    );
  }
}
//export Login Component

//export Login Component

const mapStateToProps = state => ({
  loginStateStore: state.profile,
  profileData: state.info
});

//export default Profile;
export default connect(
  mapStateToProps,
  {
    ownerProfileSave,
    ownerProfileFetch,
    lastnameChangeHandler,
    firstnameChangeHandler,
    phonenumberChangeHandler,
    rnameChangeHandler,
    cuisineChangeHandler,
    zipcodeChangeHandler
  }
)(OwnerProfile);
