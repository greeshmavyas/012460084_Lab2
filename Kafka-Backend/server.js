var connection = new require("./kafka/Connection");

//topics file
var logintopics = require("./services/logintopics.js");
var customeritemoperationstopics = require("./services/customeritemoperationstopics.js");
var owneritemoperationstopics = require("./services/owneritemoperationstopics.js");
var customerorderoperationstopics = require("./services/customerorderoperationstopics.js");
var ownerorderoperationstopics = require("./services/ownerorderoperationstopics.js");
var emailtopics = require("./services/emailtopics.js");

// Set up Database connection
var config = require("./config/settings");
var mongoose = require("mongoose");
var connStr =
  config.database_type +
  "+srv://" +
  config.database_username +
  ":" +
  config.database_password +
  "@" +
  config.database_host +
  ":" +
  "/" +
  config.database_name;
console.log(connStr);
mongoose.connect(connStr, { useNewUrlParser: true, poolSize: 10 }, function(
  err
) {
  if (err) throw err;
  else {
    console.log("Successfully connected to MongoDB");
  }
});

console.log("Kafka server is running ");

function handleTopicRequest(topic_name, fname) {
  console.log("topic_name:", topic_name);
  var consumer = connection.getConsumer(topic_name);
  console.log("gree1" + consumer);
  var producer = connection.getProducer();
  var str = JSON.stringify(producer);
  console.log("gree2");
  consumer.on("error", function(err) {
    console.log("Kafka Error: Consumer - " + err);
  });
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    switch (topic_name) {
      case "login_topics":
        logintopics.loginService(data.data, function(err, res) {
          response(data, res, producer);
          return;
        });
        break;
      case "customer_item_operations_topics":
        customeritemoperationstopics.customeritemoperationsService(
          data.data,
          function(err, res) {
            response(data, res, producer);
            return;
          }
        );
        break;

      case "owner_item_operations_topics":
        owneritemoperationstopics.owneritemoperationsService(
          data.data,
          function(err, res) {
            response(data, res, producer);
            return;
          }
        );
        break;
      case "customer_order_operations_topics":
        customerorderoperationstopics.ownerorderoperationsService(
          data.data,
          function(err, res) {
            response(data, res, producer);
            return;
          }
        );
        break;
      case "owner_order_operations_topics":
        ownerorderoperationstopics.ownerorderoperationsService(
          data.data,
          function(err, res) {
            response(data, res, producer);
            return;
          }
        );
        break;
      case "property_topics":
        propertytopics.propertyService(data.data, function(err, res) {
          response(data, res, producer);
          return;
        });
        break;

      case "email_topics":
        emailtopics.emailService(data.data, function(err, res) {
          response(data, res, producer);
          return;
        });
        break;
    }
  });
}

function response(data, res, producer) {
  console.log("after handle", res);
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res
      }),
      partition: 0
    }
  ];
  producer.send(payloads, function(err, data) {
    console.log("producer send", data);
  });
  return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login_topics", logintopics);
handleTopicRequest(
  "customer_item_operations_topics",
  customeritemoperationstopics
);

handleTopicRequest("owner_item_operations_topics", owneritemoperationstopics);
handleTopicRequest(
  "customer_order_operations_topics",
  customerorderoperationstopics
);
handleTopicRequest("owner_order_operations_topics", ownerorderoperationstopics);

//handleTopicRequest("email_topics", emailtopics);
