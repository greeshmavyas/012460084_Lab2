var Items = require("../models/ItemsSchema");
var Restaurants = require("../models/RestaurantSchema");

exports.customeritemoperationsService = function customeritemoperationsService(
  msg,
  callback
) {
  console.log("In customeritemoperations Service path:", msg.path);
  switch (msg.path) {
    case "restaurantsfetch":
      restaurantsfetch(msg, callback);
      break;

    case "itemsfetchbyrestid":
      itemsfetchbyrestid(msg, callback);
      break;
  }
};

function restaurantsfetch(msg, callback) {
  console.log("In customeritemoperations topic service. Msg: ", msg);
  Items.find({ item_name: msg.itemName }, function(err, result) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else if (result) {
      console.log("resultdfsdf" + result);
      var restIds = [];
      for (i = 0; i < result.length; i++) {
        restIds[i] = result[i]["restaurant_Id"];
      }
      console.log(restIds);

      Restaurants.find({ _id: { $in: restIds } }, function(err, rests) {
        if (err) {
          console.log(err);
          console.log("unable to read the database");
          callback(err, "unable to read the database");
        } else if (rests) {
          console.log("rests" + rests);

          callback(null, {
            status: 200,
            responseMessage: "Restaurant info fetched",
            rests
          });
        }
      });
    }
  });
}

function itemsfetchbyrestid(msg, callback) {
  console.log("In customeritemoperations topic service. Msg: ", msg);
  Items.find({ restaurant_Id: msg.restId }, function(err, items) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else if (items) {
      console.log("items:", items);
      callback(null, {
        status: 200,
        responseMessage: "Items info fetched",
        items
      });
    }
  });
}
