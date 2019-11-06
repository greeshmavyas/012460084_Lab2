var Orders = require("../models/OrdersSchema");
var Restaurants = require("../models/RestaurantSchema");
var Items = require("../models/ItemsSchema");
exports.ownerorderoperationsService = function ownerorderoperationsService(
  msg,
  callback
) {
  console.log("In customer item operation service path:", msg.path);
  switch (msg.path) {
    case "placeorder":
      placeorder(msg, callback);
      break;
    case "upcomingorders":
      upcomingorders(msg, callback);
      break;
    case "pastorders":
      pastorders(msg, callback);
      break;
  }
};

//Place order
function placeorder(msg, callback) {
  Orders.create(msg.orderData, function(err, order) {
    if (err) {
      console.log(err);
      console.log("unable to place order");
      callback(err, "Database Error");
    } else {
      console.log("order Placed");
      callback(null, { status: 200, order });
    }
  });
}

//Upcoming orders
function upcomingorders(msg, callback) {
  Orders.find(
    {
      email: msg.email,
      status: {
        $in: ["New", "Preparing", "Ready"]
      }
    },
    function(err, upcomingOrders) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log(JSON.stringify(upcomingOrders));

        console.log("im inside");
        for (let j = 0; j < upcomingOrders.length; j++) {
          for (let i = 0; i < upcomingOrders[j].ordered_items.length; i++) {
            Items.find(
              {
                _id: upcomingOrders[j].ordered_items[i].itemId
              },
              function(err, itemInfo) {
                if (err) {
                  console.log(err);
                  console.log("unable to place order");
                  callback(err, "Database Error");
                } else {
                  console.log("item info" + JSON.stringify(itemInfo));
                  upcomingOrders[j].ordered_items[i].item_name =
                    itemInfo[0].item_name;
                  console.log(
                    "---" + upcomingOrders[j].ordered_items[i].item_name
                  );
                  upcomingOrders[j].ordered_items[i].item_image_path =
                    itemInfo[0].item_image_path;
                  upcomingOrders[j].ordered_items[i].quantity =
                    itemInfo[0].quantity;
                  // console.log("jd---" + JSON.stringify(upcomingOrders));
                }
              }
            );
          }
          if (j === upcomingOrders.length - 1) {
            console.log("Upcoming orders obtained" + upcomingOrders);
            callback(null, { status: 200, upcomingOrders });
          }
        }
      }
    }
  );
}

//Place order
function pastorders(msg, callback) {
  Orders.find(
    {
      email: msg.email,
      status: {
        $in: ["delivered", "canceled", "Delivered", "Canceled"]
      }
    },
    function(err, pastOrders) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log("Upcoming orders obtained" + pastOrders);
        callback(null, { status: 200, pastOrders });
      }
    }
  );
}
