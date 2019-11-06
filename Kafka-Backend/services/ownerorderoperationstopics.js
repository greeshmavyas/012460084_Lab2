var Orders = require("../models/OrdersSchema");
var Restaurants = require("../models/RestaurantSchema");

exports.ownerorderoperationsService = function ownerorderoperationsService(
  msg,
  callback
) {
  console.log("In owner orders operations Service path:", msg.path);
  switch (msg.path) {
    case "updatestatus":
      updatestatus(msg, callback);
      break;

    case "pastorders":
      pastorders(msg, callback);
      break;

    case "pendingorders":
      pendingorders(msg, callback);
      break;

    case "orders":
      orders(msg, callback);
      break;

    case "onlyorders":
      onlyorders(msg, callback);
      break;
  }
};

//update status
function updatestatus(msg, callback) {
  console.log("In update order status  topic service. Msg: ", msg);
  console.log("dfsfs" + msg.status);
  var statusData = {
    status: msg.status
  };
  Orders.findOneAndUpdate(
    { _id: msg.orderId },
    statusData,
    { returnNewDocument: true },
    function(err, order) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        callback(err, "unable to update database");
      } else {
        console.log("result:", order);
        console.log("Customer Profile save Successful");
        callback(null, { status: 200, order });
      }
    }
  );
}

//Pending orders using rest id
function pendingorders(msg, callback) {
  Orders.find(
    {
      restaurant_Id: msg.restaurant_Id,
      status: {
        $in: ["New", "Preparing", "Ready", "new", "preparing", "ready"]
      }
    },
    function(err, pendingOrders) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log("Pending orders obtained" + pendingOrders);
        callback(null, { status: 200, pendingOrders });
      }
    }
  );
}

//Past orders using rest id
function pastorders(msg, callback) {
  console.log("restid" + msg.restaurant_Id);
  Orders.find(
    {
      restaurant_Id: msg.restaurant_Id,
      status: {
        $in: ["Delivered", "Canceled", "delivered", "canceled"]
      }
    },
    function(err, pastOrders) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log("Past orders obtained" + pastOrders);
        callback(null, { status: 200, pastOrders });
      }
    }
  );
}

//get owners orders using his email id
function orders(msg, callback) {
  console.log("email" + msg.email);
  Restaurants.findOne(
    {
      email: msg.email
    },
    function(err, rest) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log(rest);
        var restId = rest._id;

        Orders.find(
          {
            restaurant_Id: restId
          },
          function(err, orders) {
            if (err) {
              console.log(err);
              console.log("unable to place order");
              callback(err, "Database Error");
            } else {
              console.log("owner orders obtained" + orders);
              callback(null, { status: 200, orders });
            }
          }
        );
      }
    }
  );
}

//get owners orders using his email id. Same as the orders function
function onlyorders(msg, callback) {
  console.log("email" + msg.email);
  Restaurants.findOne(
    {
      email: msg.email
    },
    function(err, rest) {
      if (err) {
        console.log(err);
        console.log("unable to place order");
        callback(err, "Database Error");
      } else {
        console.log(rest);
        var restId = rest._id;

        Orders.find(
          {
            restaurant_Id: restId,
            status: {
              $in: ["New", "Ready", "Preparing", "new", "ready", "preparing"]
            }
          },
          function(err, orders) {
            if (err) {
              console.log(err);
              console.log("unable to place order");
              callback(err, "Database Error");
            } else {
              console.log("owner orders obtained" + orders);
              callback(null, { status: 200, orders });
            }
          }
        );
      }
    }
  );
}
