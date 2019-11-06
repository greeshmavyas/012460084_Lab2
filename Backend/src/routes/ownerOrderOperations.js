//Libraries
var express = require("express");
var router = express.Router();
var kafka = require("../routes/kafka/client");
var config = require("../../config/settings");

// Set up middleware
var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

//update the status of the order
router
  .route("/owner/orders/updatestatus")
  .post(requireAuth, function(req, res) {
    console.log("In update order status post" + req);

    kafka.make_request(
      "owner_order_operations_topics",
      {
        path: "updatestatus",
        status: req.body.status,
        orderId: req.body.order_id
      },
      function(err, result) {
        if (err) {
          console.log(error);
          console.log("unable to update database");
          res
            .status(400)
            .json({ responseMessage: "unable to update database" });
        } else {
          console.log(result);

          res.writeHead(
            200,

            { "content-type": "application/json" }
          );
          res.end(JSON.stringify(result.order));
        }
      }
    );
  });

//owner's past orders with rest id
router.route("/owner/orders/past").post(requireAuth, function(req, res) {
  console.log("In get past orders by email id");
  var restaurantId = req.body.restaurantId;

  kafka.make_request(
    "owner_order_operations_topics",
    { path: "pastorders", restaurant_Id: restaurantId },
    function(err, result) {
      console.log("asdfsdf", +result);
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find past orders" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.orders));
      }
    }
  );
});

//owner's pending orders with rest id
router.route("/owner/orders/pending").post(requireAuth, function(req, res) {
  console.log("In get past orders by email id");
  var restaurantId = req.body.restaurantId;

  kafka.make_request(
    "owner_order_operations_topics",
    { path: "pendingorders", restaurant_Id: restaurantId },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find past orders" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.pendingOrders));
      }
    }
  );
});

//get owner's orders by email

router.route("/owner/orders").post(function(req, res) {
  var email = req.body.email;

  kafka.make_request(
    "owner_order_operations_topics",
    { path: "orders", email: email },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find past orders" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.orders));
      }
    }
  );
});

//get owner's orders only by email

router.route("/owner/onlyOrders").post(function(req, res) {
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();

  kafka.make_request(
    "owner_order_operations_topics",
    { path: "onlyorders", email: trimemail },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find past orders" });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.orders));
      }
    }
  );
});

module.exports = router;
