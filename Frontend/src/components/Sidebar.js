import React, { Component } from "react";
import styles from "./sideBarMenu.css";
import cookie from "react-cookies";

var email = cookie.load("cookie2");
const MenuComponent = ({ onClick }) => {
  return (
    <div class="sidebar mytext">
      <h4>GrubHub for restaurant</h4>
      <a onClick={onClick} name="Profile" href="#">
        Profile
      </a>
      <a onClick={onClick} name="Orders" href="#">
        Orders
      </a>
      <a onClick={onClick} name="ManageOrders" href="#">
        Manage Orders
      </a>
      <a onClick={onClick} name="Menu" href="#">
        Menu
      </a>
      <a onClick={onClick} name="AddItem" href="#">
        Add an Item
      </a>
    </div>
  );
};

//export Sidebar Component
export default MenuComponent;
