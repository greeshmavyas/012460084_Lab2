var Items = require("../models/ItemsSchema");
var Restaurants = require("../models/RestaurantSchema");

exports.owneritemoperationsService = function owneritemoperationsService(
  msg,
  callback
) {
  console.log("In Login Service path:", msg.path);
  switch (msg.path) {
    case "restaurantsfetchbyemail":
      restaurantsfetchbyemail(msg, callback);
      break;
    case "additem":
      additem(msg, callback);
      break;
    case "deleteitem":
      deleteitem(msg, callback);
      break;
    case "getitems":
      getitems(msg, callback);
      break;

    case "uploadItemImage":
      uploadItemImage(msg, callback);
      break;
  }
};

//get restaurant details by email
function restaurantsfetchbyemail(msg, callback) {
  Restaurants.findOne({ email: msg.email }, function(err, restaurants) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else {
      console.log("restaurants:", restaurants);
      console.log("Restaurants fetch Successful");
      callback(null, { status: 200, restaurants });
    }
  });
}

//add item
function additem(msg, callback) {
  Restaurants.findOne({ email: msg.email }, function(err, restaurants) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else {
      console.log("restaurants:", restaurants);
      console.log("Restaurants fetch Successful");
      var restId = restaurants._id;
      console.log(restId);
      var item_name = msg.body.itemName;
      Items.findOne({ restaurant_Id: restId, item_name: item_name }, function(
        err,
        rows
      ) {
        if (err) {
          console.log(err);
          console.log("unable to read the database");
          callback(err, "unable to read the database");
        } else {
          if (rows) {
            console.log("Item already exists");
            callback(null, { status: 401, rows });
          } else {
            var itemData = {
              restaurant_Id: restId,
              item_name: item_name,
              price: msg.body.price,
              item_description: msg.body.itemDescription,
              section: msg.body.itemSection
            };
            console.log("itemData:" + JSON.stringify(itemData));
            Items.create(itemData, function(err, item) {
              if (err) {
                console.log(err);
                console.log("unable to insert item");
                callback(err, "Database Error");
              } else {
                console.log("Item Added");
                callback(null, { status: 200, item });
              }
            });
          }
        }
      });
    }
  });
}

//delete item
function deleteitem(msg, callback) {
  Items.remove({ _id: msg.itemId }, function(err) {
    if (err) {
      console.log(err);
      console.log("unable to delete from database");
      callback(err, "unable to delete item from database");
    } else {
      callback(null, { status: 200, responseMessage: "Item deleted" });
    }
  });
}

//get all items by rest id
function getitems(msg, callback) {
  Restaurants.findOne({ email: msg.email }, function(err, restaurants) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else {
      console.log("restaurants:", restaurants);
      console.log("Restaurants fetch Successful");
      var restId = restaurants._id;
      console.log(restId);
      Items.find({ restaurant_Id: restId }, function(err, items) {
        if (err) {
          console.log(err);
          console.log("Unable to fetch details from items table");
          callback(err, "Unable to fetch details from items table");
        } else {
          console.log("Item already exists");
          callback(null, { status: 200, items });
        }
      });
    }
  });
}

function uploadItemImage(msg, callback) {
  console.log("In customer profile save topic service. Msg: ", msg);
  Items.findOneAndUpdate(
    { _id: msg.itemId },
    msg.userData,
    { returnNewDocument: true },
    function(err, owneritem) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        callback(err, "unable to update database");
      } else {
        console.log("result:", owneritem);
        console.log("Owner Profile save Successful");
        callback(null, { status: 200, owneritem });
      }
    }
  );
}
