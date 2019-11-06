var crypt = require("../models/bcrypt.js");

var Customers = require("../models/CustomersSchema");
var Owners = require("../models/OwnersSchema");
var Restaurants = require("../models/RestaurantSchema");

exports.loginService = function loginService(msg, callback) {
  console.log("In Login Service path:", msg.path);
  switch (msg.path) {
    case "customerlogin":
      customerlogin(msg, callback);
      break;
    case "ownerlogin":
      ownerlogin(msg, callback);
      break;
    case "customersignup":
      customersignup(msg, callback);
      break;
    case "ownersignup":
      ownersignup(msg, callback);
      break;
    case "customerprofilesave":
      customerprofilesave(msg, callback);
      break;
    case "ownerprofilesave":
      ownerprofilesave(msg, callback);
      break;
    case "customerprofilefetch":
      customerprofilefetch(msg, callback);
      break;
    case "ownerprofilefetch":
      ownerprofilefetch(msg, callback);
      break;
  }
};

function customerlogin(msg, callback) {
  console.log("In customerlogin topic service. Msg: ", msg);
  Customers.findOne({ email: msg.trimemail }, function(err, user) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else if (user) {
      console.log("customer:", user);
      crypt.compareHash(msg.password, user.password, function(err, isMatch) {
        if (isMatch && !err) {
          console.log("Customer Login Successful");
          callback(null, { status: 200, user });
        } else {
          console.log("Authentication failed. Passwords did not match");
          callback(null, { status: 401 });
        }
      });
    } else {
      console.log("Authentication failed. User does not exist.");
      callback(null, { status: 402 });
    }
  });
}

function ownerlogin(msg, callback) {
  console.log("In ownerlogin topic service. Msg: ", msg);
  Owners.findOne({ email: msg.trimemail }, function(err, user) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "unable to read the database");
    } else if (user) {
      console.log("Owner:", user);
      crypt.compareHash(msg.password, user.password, function(err, isMatch) {
        if (isMatch && !err) {
          console.log("Owner Login Successful");
          callback(null, { status: 200, user });
        } else {
          console.log("Authentication failed. Passwords did not match");
          callback(null, { status: 401 });
        }
      });
    } else {
      console.log("Authentication failed. Owner does not exist.");
      callback(null, { status: 402 });
    }
  });
}

function customersignup(msg, callback) {
  console.log("In traveller signup topic service. Msg: ", msg);
  Customers.findOne({ email: msg.trimemail }, function(err, rows) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "Dtaabase Error");
    } else {
      if (rows) {
        console.log("Customer already exists");
        callback(null, { status: 401, rows });
      } else {
        crypt.createHash(msg.body.password, function(response) {
          encryptedPassword = response;
          var userData = {
            first_name: msg.body.firstname,
            last_name: msg.body.lastname,
            email: msg.trimemail,
            password: encryptedPassword,
            phone_Number: msg.body.phone
          };

          //Save the user in database
          Customers.create(userData, function(err, user) {
            if (err) {
              console.log("unable to insert into database", err);
              callback(err, "Database Error");
            } else {
              console.log("Customer Signup Successful");
              callback(null, { status: 200, user });
            }
          });
        });
      }
    }
  });
}

function ownersignup(msg, callback) {
  Owners.findOne({ email: msg.trimemail }, function(err, rows) {
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      callback(err, "Database Error");
    } else {
      console.log("rows", rows);
      if (rows) {
        console.log("Owner already exists");
        callback(null, { status: 401, rows });
      } else {
        crypt.createHash(msg.body.password, function(response) {
          encryptedPassword = response;

          var restaurantData = {
            restaurant_name: msg.body.rname,
            cuisine: msg.body.cuisine,
            email: msg.trimemail,
            zip_code: msg.body.zipcode
          };
          var userData = {
            first_name: msg.body.firstname,
            last_name: msg.body.lastname,
            email: msg.trimemail,
            password: encryptedPassword,
            phone_Number: msg.body.phone
          };

          //Save the owner and restaurant in the database
          Owners.create(userData, function(err, user) {
            if (err) {
              console.log(err);
              console.log("unable to update user to owner");
              callback(err, "Database Error");
            } else {
              console.log("Owner Added");
              Restaurants.create(restaurantData, function(err, user) {
                if (err) {
                  console.log(err);
                  console.log("unable to update user to owner");
                  callback(err, "Database Error");
                } else {
                  console.log("Restaurant Added");
                  callback(null, { status: 200, user });
                }
              });
            }
          });
        });
      }
    }
  });
}

function customerprofilesave(msg, callback) {
  console.log("In customer profile save topic service. Msg: ", msg);
  Customers.findOneAndUpdate(
    { email: msg.input_email },
    msg.userData,
    { returnNewDocument: true },
    function(err, user) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        callback(err, "unable to update database");
      } else {
        console.log("result:", user);
        console.log("Customer Profile save Successful");
        callback(null, { status: 200, user });
      }
    }
  );
}

function ownerprofilesave(msg, callback) {
  console.log("In customer profile save topic service. Msg: ", msg);
  Owners.findOneAndUpdate(
    { email: msg.input_email },
    msg.ownerData,
    { returnNewDocument: true },
    function(err, owner) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        callback(err, "unable to update database");
      } else {
        console.log("result:", owner);
        console.log("Owner Profile save Successful");

        Restaurants.findOneAndUpdate(
          { email: msg.input_email },
          msg.restaurantData,
          { returnNewDocument: true },
          function(err, restaurant) {
            if (err) {
              console.log(err);
              console.log("unable to update database");
              callback(err, "unable to update database");
            } else {
              console.log("result:", restaurant);
              var ownerRest = { ...owner, ...restaurant };
              console.log("Restaurant details Successfully updated");
              callback(null, { status: 200, ownerRest });
            }
          }
        );
      }
    }
  );
}

function customerprofilefetch(msg, callback) {
  console.log("In profile fetch topic service. Msg: ", msg);
  Customers.findOne({ email: msg.input_email }, function(err, user) {
    if (err) {
      console.log(err);
      console.log("Customer not found");
      callback(err, "Customer not found");
    } else {
      console.log("user:", user);
      console.log("Customer profile fetch Successful");
      callback(null, { status: 200, user });
    }
  });
}

function ownerprofilefetch(msg, callback) {
  console.log("In profile fetch topic service. Msg: ", msg);
  Owners.findOne({ email: msg.input_email }, function(err, user) {
    if (err) {
      console.log(err);
      console.log("Customer not found");
      callback(err, "Customer not found");
    } else {
      console.log("user:", user);
      console.log("Customer profile fetch Successful");

      Restaurants.findOne({ email: msg.input_email }, function(
        err,
        restaurant
      ) {
        if (err) {
          console.log(err);
          console.log("Restaurant not found");
          callback(err, "Restaurant not found");
        } else {
          console.log("restaurant:", restaurant);
          console.log("Restaurant fetch Successful");
          callback(null, { status: 200, user, restaurant });
        }
      });
    }
  });
}
