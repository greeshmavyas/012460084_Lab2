//Libraries
var express = require("express");
var router = express.Router();
var kafka = require("../routes/kafka/client");
var config = require("../../config/settings");

// Set up middleware
var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

//get restaurant details by email
router.route("/owner/restaurant/getid").post(requireAuth, function(req, res) {
  console.log("get restaurant details by email");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  kafka.make_request(
    "owner_item_operations_topics",
    { path: "restaurantsfetchbyemail", email: trimemail },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Particular restaurant not found"
        });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result));
      }
    }
  );
});

//add item
router.route("/owner/menu/insertitem").post(requireAuth, function(req, res) {
  console.log("In owner item insert Post");
  console.log(req.body);

  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  kafka.make_request(
    "owner_item_operations_topics",
    { path: "additem", email: trimemail, body: req.body },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Unable to insert item. DB error"
        });
      } else if (result.status === 401) {
        console.log("Item already exists for the particular restaurant");
        res.status(401).json({
          responseMessage: "Item already exists for the particular restaurant"
        });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.item));
      }
    }
  );
});

//delete Item
router.route("/owner/menu/delete").post(requireAuth, function(req, res) {
  console.log("delete item");
  console.log(req.body);

  var itemId = req.body.itemId;
  kafka.make_request(
    "owner_item_operations_topics",
    { path: "deleteitem", itemId: itemId },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Unable to delete the item"
        });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result));
      }
    }
  );
});

//get all the items by restaurant id
router
  .route("/owner/getAllItemsByRestId")
  .post(requireAuth, function(req, res) {
    console.log("get all items details by rest id");
    console.log(req.body);
    email = req.body.email.toLowerCase();
    trimemail = email.trim();
    kafka.make_request(
      "owner_item_operations_topics",
      { path: "getitems", email: trimemail },
      function(err, result) {
        if (err) {
          console.log(err);
          res.status(400).json({
            responseMessage: "This rest has no items"
          });
        } else {
          res.writeHead(200, {
            "content-type": "application/json"
          });
          res.end(JSON.stringify(result.items));
        }
      }
    );
  });

module.exports = router;
