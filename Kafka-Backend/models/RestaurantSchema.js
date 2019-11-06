var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//schema
RestaurantSchema = new Schema({
  email: {
    type: String,
    default: ""
  },
  cuisine: {
    type: String,
    default: ""
  },
  restaurant_name: {
    type: String,
    default: ""
  },
  zip_code: {
    type: String,
    default: ""
  },
  rest_image_name: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Restaurants", RestaurantSchema);
