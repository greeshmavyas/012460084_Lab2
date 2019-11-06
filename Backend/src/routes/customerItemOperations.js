//Libraries
var express = require("express");
var router = express.Router();
var kafka = require("../routes/kafka/client");
var config = require("../../config/settings");

// Set up middleware
var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

//get all the restaurants by item name
router
  .route("/customer/getRestaurantsByItemName")
  .post(requireAuth, function(req, res) {
    console.log("In  get restaurants by item name");
    var itemName = req.body.itemName;
    kafka.make_request(
      "customer_item_operations_topics",
      { path: "restaurantsfetch", itemName: itemName },
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
          res.end(JSON.stringify(result.rests));
        }
      }
    );
  });

//get all the items by restaurant id
router.route("/customer/getAllItemsByRestId").post(function(req, res) {
  console.log("In get items by restaurant id");
  restId = req.body.restaurantId;
  console.log("restid" + restId);

  kafka.make_request(
    "customer_item_operations_topics",
    { path: "itemsfetchbyrestid", restId: restId },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "Unable to find items info" });
      } else {
        console.log(result);
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result.items));
      }
    }
  );
});

module.exports = router;
