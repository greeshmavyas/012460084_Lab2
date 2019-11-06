var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//schema
ItemsSchema = new Schema({
  restaurant_Id: {
    type: String,
    default: ""
  },
  item_name: {
    type: String,
    default: ""
  },
  price: {
    type: String,
    default: ""
  },
  item_description: {
    type: String,
    default: ""
  },
  section: {
    type: String,
    default: ""
  },
  item_image_name: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Items", ItemsSchema);
