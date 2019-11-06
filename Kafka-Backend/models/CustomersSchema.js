var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//schema
CustomersSchema = new Schema({
  email: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  first_name: {
    type: String,
    default: ""
  },
  last_name: {
    type: String,
    default: ""
  },
  phone_number: {
    type: String,
    default: ""
  },
  image_name: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Customers", CustomersSchema);
