//Libraries
var express = require("express");
var router = express.Router();
var kafka = require("../routes/kafka/client");
var config = require("../../config/settings");

// Set up middleware
var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

// Validate customer login user details and get a JSON Web Token to include in the header of future requests.
router.route("/customer/login").post(function(req, res) {
  console.log("Inside customer Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();

  kafka.make_request(
    "login_topics",
    {
      path: "customerlogin",
      trimemail: trimemail,
      password: req.body.password
    },
    function(err, result) {
      if (err) {
        res
          .status(400)
          .json({ responseMessage: "unable to read the users database" });
      } else if (result.status === 200) {
        console.log("result:", result);
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(
          { id: result.user._id, email: result.user.email },
          config.secret_key,
          {
            expiresIn: 7200 // expires in 2 hours
          }
        );
        req.session.user = result.user.email;
        //It’s important the Auth header starts with JWT and a whitespace followed by the token, else passport-jwt will not extract it.
        res.status(200).json({
          responseMessage: "Login Successful",
          token: "JWT " + token,
          cookie1: "customercookie",
          cookie2: trimemail,
          cookie3: result.user.firstname,
          cookie4: result.user.lastname
        });
        console.log("Customer found in DB");
      } else if (result.status === 401) {
        res.status(401).json({
          responseMessage: "Authentication failed. Password did not match."
        });
        console.log("Authentication failed. Passwords did not match.");
      } else if (result.status === 402) {
        res.status(402).json({
          responseMessage: "Authentication failed. Customer does not exist."
        });
        console.log("Authentication failed. Customer does not exist.");
      }
    }
  );
});

// Validate owner login user details and get a JSON Web Token to include in the header of future requests.
router.route("/owner/login").post(function(req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();

  kafka.make_request(
    "login_topics",
    { path: "ownerlogin", trimemail: trimemail, password: req.body.password },
    function(err, result) {
      if (err) {
        res.status(400).json({ responseMessage: "Database Error" });
      } else if (result.status === 200) {
        console.log("result:", result);
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(
          { id: result.user._id, email: result.user.email },
          config.secret_key,
          {
            expiresIn: 7200 // expires in 2 hours
          }
        );
        req.session.user = result.user.email;
        //It’s important the Auth header starts with JWT and a whitespace followed by the token, else passport-jwt will not extract it.
        res.status(200).json({
          responseMessage: "Login Successful",
          token: "JWT " + token,
          cookie1: "ownercookie",
          cookie2: trimemail,
          cookie3: result.user.firstname,
          cookie4: result.user.lastname
        });
        console.log("Owner found in DB and token is", token);
      } else if (result.status === 401) {
        res.status(401).json({
          responseMessage: "Authentication failed. Password did not match."
        });
        console.log("Authentication failed. Password did not match.");
      } else if (result.status === 402) {
        res.status(402).json({
          responseMessage: "Authentication failed. Owner does not exist."
        });
        console.log("Authentication failed. Owner does not exist.");
      }
    }
  );
});

// Add traveller users and get a JSON Web Token to include in the header of future requests.
router.route("/customer/signup").post(function(req, res) {
  console.log("In customer Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  kafka.make_request(
    "login_topics",
    { path: "customersignup", trimemail: trimemail, body: req.body },
    function(err, result) {
      if (err) {
        res.status(400).json({ responseMessage: "Database Error" });
      } else if (result.status === 200) {
        console.log("Customer Added");
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(
          { id: result.user._id, email: result.user.email },
          config.secret_key,
          {
            expiresIn: 7200 // expires in 2 hours
          }
        );
        res.status(200).json({
          responseMessage: "Customer Added",
          token: "JWT " + token,
          cookie1: "customercookie",
          cookie2: trimemail,
          cookie3: req.body.firstname,
          cookie4: req.body.lastname
        });
      } else if (result.status === 401) {
        console.log("Customer already exists");
        res.status(401).json({ responseMessage: "Customer already exists" });
      }
    }
  );
});

// Add owner users and get a JSON Web Token to include in the header of future requests.
router.route("/owner/signup").post(function(req, res) {
  console.log("In owner Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  kafka.make_request(
    "login_topics",
    { path: "ownersignup", trimemail: trimemail, body: req.body },
    function(err, result) {
      if (err) {
        console.log(err);
        console.log("Database Error");
        res.status(400).json({ responseMessage: "Database Error" });
      } else if (result.status === 400) {
        console.log("Owner already exists");
        res.status(400).json({ responseMessage: "Owner already exists" });
      } else if (result.status === 200) {
        console.log("Owner Added");
        // Create token if the password matched and no error was thrown
        var token = jwt.sign(
          { id: result.user._id, email: result.user.email },
          config.secret_key,
          {
            expiresIn: 7200 // expires in 2 hours
          }
        );
        res.status(200).json({
          responseMessage: "Owner and restaurant Added",
          token: "JWT " + token,
          cookie1: "ownercookie",
          cookie2: trimemail,
          cookie3: req.body.firstname,
          cookie4: req.body.lastname
        });
      }
    }
  );
});

// save customer profile details
router.route("/customer/profilesave").post(requireAuth, function(req, res) {
  console.log("In customer profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  var userData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    phone_number: req.body.phone
  };
  console.log(userData);
  kafka.make_request(
    "login_topics",
    { path: "customerprofilesave", input_email: trimemail, userData: userData },
    function(error, result) {
      if (error) {
        console.log(error);
        console.log("unable to update database");
        res.status(400).json({ responseMessage: "unable to update database" });
      } else {
        console.log(result);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result.user));
      }
    }
  );
});

// save customer profile details
router.route("/owner/profilesave").post(requireAuth, function(req, res) {
  console.log("In owner profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var ownerData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    phone_number: req.body.phone
  };

  var restaurantData = {
    restaurant_name: req.body.rname,
    cuisine: req.body.cuisine,
    email: trimemail,
    zip_code: req.body.zipcode
  };

  console.log(ownerData);
  console.log(restaurantData);
  kafka.make_request(
    "login_topics",
    {
      path: "ownerprofilesave",
      input_email: trimemail,
      ownerData: ownerData,
      restaurantData: restaurantData
    },
    function(error, result) {
      if (error) {
        console.log(error);
        console.log("unable to update database");
        res.status(400).json({ responseMessage: "unable to update database" });
      } else {
        console.log(result);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result.ownerRest));
      }
    }
  );
});

//fetch customer details
router.route("/customer/profile").post(requireAuth, function(req, res) {
  console.log("Inside customer Profile fetch");
  var input_email = req.body.email;
  kafka.make_request(
    "login_topics",
    { path: "customerprofilefetch", input_email: input_email },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "User not found" });
      } else {
        console.log("Profile Details:", result.user);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result.user));
      }
    }
  );
});

//fetch owner and restaurant details
router.route("/owner/profile").post(requireAuth, function(req, res) {
  console.log("Inside customer Profile fetch");
  var input_email = req.body.email;
  kafka.make_request(
    "login_topics",
    { path: "ownerprofilefetch", input_email: input_email },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).json({ responseMessage: "User not found" });
      } else {
        console.log("Profile Details:", result.user);
        console.log("Restaurant Details:", result.restaurant);
        var ownerProfile = { ...result.user, ...result.restaurant };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(ownerProfile));
      }
    }
  );
});

module.exports = router;
