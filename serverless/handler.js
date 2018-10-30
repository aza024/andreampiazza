const serverless = require("serverless-http");
const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

if (!AWS.config.region) {
  AWS.config.update({
    region: "us-east-1" //example us-east-1
  });
}

const ses = new AWS.SES();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;


  const emailParams = {
    Source: "apiazza023@gmail.com", // Your Verified Email
    Destination: {
      ToAddresses: ["apiazza023@gmail.com"] // Your verfied Email
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `${message}  from  ${req.body.email}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Message from Andréa Piazza"
      }
    }
  };
});

module.exports.form = serverless(app);