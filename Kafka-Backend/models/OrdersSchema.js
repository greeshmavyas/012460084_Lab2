var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//schema
OrdersSchema = new Schema({
  restaurant_Id: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  delivery_address: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: ""
  },
  last_modified_on: {
    type: String,
    default: ""
  },
  ordered_items: {
    type: Array,
    default: ""
  }
});

module.exports = mongoose.model("Orders", OrdersSchema);
