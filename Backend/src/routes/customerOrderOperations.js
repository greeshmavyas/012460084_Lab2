//Libraries
var express = require("express");
var router = express.Router();
var kafka = require("../routes/kafka/client");
var config = require("../../config/settings");

// Set up middleware
var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

//place the order. Need restaurantId, itemId
router.route("/custormer/order").post(requireAuth, function(req, res) {
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();

  var orderData = {
    restaurant_Id: req.body.restaurantId,
    email: trimemail,
    delivery_address: req.body.deliveryAddress,
    status: "New",
    last_modified_on: today,
    ordered_items: req.body.items
  };
  kafka.make_request(
    "customer_order_operations_topics",
    { path: "placeorder", orderData: orderData },
    function(err, result) {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ responseMessage: "Unable to find restaurants info" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.order));
      }
    }
  );
});

//get the upcoming orders
router
  .route("/custormer/orders/upcoming")
  .post(requireAuth, function(req, res) {
    console.log("In get upcoming orders by email id");
    email = req.body.email.toLowerCase();
    trimemail = email.trim();

    kafka.make_request(
      "customer_order_operations_topics",
      { path: "upcomingorders", email: trimemail },
      function(err, result) {
        if (err) {
          console.log(err);
          res
            .status(400)
            .json({ responseMessage: "Unable to find upcoming orders" });
        } else {
          res.writeHead(200, {
            "content-type": "application/json"
          });
          res.end(JSON.stringify(result.upcomingOrders));
        }
      }
    );
  });

//get the past orders
router.route("/custormer/orders/past").post(requireAuth, function(req, res) {
  console.log("In get past orders by email id");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  kafka.make_request(
    "customer_order_operations_topics",
    { path: "pastorders", email: trimemail },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find past orders" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.pastOrders));
      }
    }
  );
});

module.exports = router;
