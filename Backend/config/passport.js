"use strict";
const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var Customers = require("../src/models/CustomersSchema");
var Owners = require("../src/models/OwnersSchema");
var config = require("./settings");

// Setup work and export for the JWT passport strategy
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.secret_key
};
passport.use(
  new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT Payload:", jwt_payload);
    Customers.findOne({ email: jwt_payload.email }, function(err, user) {
      if (err) {
        Owners.findOne({ email: jwt_payload.email }, function(err, owner) {
          if (err) {
            return done(err, false);
          }
          if (owner) {
            delete owner.password;
            return done(null, owner);
          } else {
            return done(null, false);
          }
        });
      }
      if (user) {
        delete user.password;
        return done(null, user);
      } else {
        Owners.findOne({ email: jwt_payload.email }, function(err, owner) {
          if (err) {
            return done(err, false);
          }
          if (owner) {
            delete owner.password;
            return done(null, owner);
          } else {
            return done(null, false);
          }
        });
      }
    });
  })
);

module.exports = passport;
