import React, { Component } from "react";

//Define a Login Component
class GrubhubHome extends Component {
  render() {
    return (
      <div
        className="container"
        style={{
          fontFamily: "Lato,Arial,Helvetica Neue,sans-serif",
          marginTop: "50px",
          width: "170px",
          height: "170px",
          marginright: "15px",
          float: "left"
        }}
      >
        <img src={require("./images/burger.png")} alt="Grubhub burger"></img>
        <p> Order food delivery you’ll love</p>
      </div>
    );
  }
}
export default GrubhubHome;
