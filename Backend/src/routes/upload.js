const path = require("path");
const multer = require("multer");
var express = require("express");
var kafka = require("../routes/kafka/client");
const router = express.Router();
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

// //update profile picture of customer
// router.route("/upload").post(upload, function(req, res) {
//   console.log("Request ---", req.body);
//   console.log("Request file ---", req.file); //Here you get file.

//   console.log(req.file.filename);

//   if (req.file) {
//     var email = req.body.email;
//     var lowercaseemail = email.toLowerCase();
//     var trimemail = lowercaseemail.trim();
//     var userData = {
//       image_name: req.file.filename
//     };

//     pool.query(
//       "UPDATE customers SET ? WHERE email = ?",
//       [userData, trimemail],
//       function(error, result) {
//         if (error) {
//           console.log(error);
//           console.log("unable to update the file into database");
//           res.status(400).json({
//             responseMessage: "unable to update the file into database"
//           });
//         } else {
//           res.status(200).json({
//             responseMessage: "File Name added",
//             fileName: req.file.filename
//           });
//         }
//       }
//     );
//   }
// });

// //update profile picture of owner

// router.route("/owner/upload").post(upload, function(req, res) {
//   console.log("Request ---", req.body);
//   console.log("Request file ---", req.file); //Here you get file.

//   console.log(req.file.filename);

//   if (req.file) {
//     var email = req.body.email;
//     var lowercaseemail = email.toLowerCase();
//     var trimemail = lowercaseemail.trim();
//     var userData = {
//       image_name: req.file.filename
//     };

//     pool.query(
//       "UPDATE owners SET ? WHERE email = ?",
//       [userData, trimemail],
//       function(error, result) {
//         if (error) {
//           console.log(error);
//           console.log("unable to update the file into database");
//           res.status(400).json({
//             responseMessage: "unable to update the file into database"
//           });
//         } else {
//           res.status(200).json({
//             responseMessage: "File Name added",
//             fileName: req.file.filename
//           });
//         }
//       }
//     );
//   }
// });

// //update  picture of restaurant
// router.route("/owner/restaurant/upload").post(upload, function(req, res) {
//   console.log("Request ---", req.body);
//   console.log("Request file ---", req.file); //Here you get file.

//   console.log(req.file.filename);

//   if (req.file) {
//     var email = req.body.email;
//     var lowercaseemail = email.toLowerCase();
//     var trimemail = lowercaseemail.trim();
//     var userData = {
//       rest_image_name: req.file.filename
//     };

//     pool.query(
//       "UPDATE restaurants SET ? WHERE email = ?",
//       [userData, trimemail],
//       function(error, result) {
//         if (error) {
//           console.log(error);
//           console.log("unable to update the file into database");
//           res.status(400).json({
//             responseMessage: "unable to update the file into database"
//           });
//         } else {
//           res.status(200).json({
//             responseMessage: "File Name added",
//             fileName: req.file.filename
//           });
//         }
//       }
//     );
//   }
// });

router.route("/item/upload").post(upload, function(req, res) {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file); //Here you get file.

  console.log(req.file.filename);

  if (req.file) {
    var userData = {
      item_image_name: req.file.filename
    };

    var itemId = req.body.itemID;
    console.log("&&&&&", req.body.itemID);

    kafka.make_request(
      "owner_item_operations_topics",
      { path: "uploadItemImage", userData: userData, itemId: itemId },
      function(err, result) {
        if (err) {
          console.log(err);
          res.status(400).json({
            responseMessage: "Unable to Update item. DB error"
          });
        } else {
          res.writeHead(200, {
            "content-type": "application/json"
          });
          res.end(JSON.stringify(result.owneritem));
        }
      }
    );
  }
});

module.exports = router;
