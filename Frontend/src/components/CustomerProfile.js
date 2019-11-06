import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./Profile.css";
import ReactUploadImage from "./ReactUploadImage";
import { connect } from "react-redux";
import {
  customerProfileFetch,
  customerProfileSave,
  lastnameChangeHandler,
  firstnameChangeHandler,
  phonenumberChangeHandler
} from "../actions/profileFetchActions";
//Define a OwnerProfile Component
class CustomerProfile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      profiledata: [],
      profileImagePath: ""
    };

    //Bind the handlers to this class
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.readFileName = this.readFileName.bind(this);
  }

  readFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ profileImagePath: fileName });
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
      this.props.customerProfileFetch(data, config);
    }
  }

  componentDidUpdate() {
    //this.setState({ profiledata: this.props.profileData.result });
    console.log("i am setting the state here" + JSON.stringify(this.state));
    this.refs.myfirstname.value = this.props.profileData.result.first_name;

    this.refs.myfirstname.value = this.props.profileData.result.first_name;

    this.refs.mylastname.value = this.props.profileData.result.last_name;

    this.refs.phone.value = this.props.profileData.result.phone_number;

    //this.refs.email.value = this.props.profileData.result.email;
    this.state.profileImagePath = this.props.profileData.result.image_name;
  }
  firstnameChangeHandler = e => {
    this.props.firstnameChangeHandler(e);
  };

  lastnameChangeHandler = e => {
    this.props.lastnameChangeHandler(e);
  };

  phoneChangeHandler = e => {
    this.props.phonenumberChangeHandler(e);
  };

  handleValidation() {
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

    return formIsValid;
  }

  //submit Login handler to send a request to the node backend
  saveChanges(event) {
    console.log("Inside save form");
    //prevent page from refresh
    event.preventDefault();
    if (this.handleValidation()) {
      console.log("Profile Form data submitted");
      var input_email = this.props.loginStateStore.result.email;
      console.log(input_email);
      const data = {
        firstname: this.props.profileData.result.first_name,
        lastname: this.props.profileData.result.last_name,
        phone: this.props.profileData.result.phone_number,
        email: input_email
      };
      var config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      axios.defaults.withCredentials = true;
      this.props.customerProfileSave(data, config);
    }
  }

  render() {
    let redirectVar = null;
    const baseImagePath = "http://localhost:3001/";
    if (
      !this.props.loginStateStore.result ||
      this.props.loginStateStore.result.isAuthenticated === false ||
      this.props.loginStateStore.result.ownerOrBuyer != "customercookie"
    ) {
      redirectVar = <Redirect to="/" />;
    }

    return (
      <div>
        {redirectVar}

        <div id="profilehref" class="myprofilecontainer">
          <div class="login-form">
            <br /> <br />
            <div class="uploadImg">
              <ReactUploadImage readFileName={this.readFileName} />
            </div>
            <br />
            <br />
            <h2>Account Information</h2>
            <br></br>
            <div className="pull-right">
              <img
                alt="Thumbnail View of Profile picture"
                className="img-responsive profilepic"
                src={
                  baseImagePath + this.props.loginStateStore.result.image_path
                }
              />
            </div>
            <br /> <br />
            <div class="form-group">
              <p>First Name </p>
              <input
                ref="myfirstname"
                onChange={this.firstnameChangeHandler}
                type="text"
                class="form-control"
                name="firstname"
                placeholder="First Name"
                // value={profileData.result.first_name}
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
              <br></br>
              <div class="form-group">
                <p>Email: </p>

                <h4> {this.props.loginStateStore.result.email}</h4>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div class="col-md-10 text-center">
          <button onClick={this.saveChanges} class="btn-primary btn-lg">
            Save Changes
          </button>
          <br />
          <br />
          <br />
        </div>

        <br />
      </div>
    );
  }
}
//export Login Component

const mapStateToProps = state => ({
  loginStateStore: state.profile,
  profileData: state.info
});

//export default Profile;
export default connect(
  mapStateToProps,
  {
    customerProfileFetch,
    customerProfileSave,
    firstnameChangeHandler,
    lastnameChangeHandler,
    phonenumberChangeHandler
  }
)(CustomerProfile);
