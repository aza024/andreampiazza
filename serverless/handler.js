const serverless = require("serverless-http");
const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const env = require('node-env-file');
env(__dirname + '/.env');

console.log("Starting app")
const app = express();
console.log("App Started")
if (!AWS.config.region) {
  AWS.config.update({
    region: "us-east-1"
  });
}

const ses = new AWS.SES();
console.log("ses Started")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/contact-form", (req, res) => {
  console.log("Handling /")

  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  console.log('process.env.EMAIL ' + process.env.EMAIL)
  const emailParams = {
    Source: process.env.EMAIL, // Your Verified Email
    Destination: {
      ToAddresses: [process.env.EMAIL] // Your verfied Email
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
        Data: "You Received a Message from Andrea Piazza"
      }
    }
  };
  console.log("Sending Email Started")

  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      console.log('error ' + err)
      res.status(402).send(`${err} ${err.stack}`);
    }
    if (data) {
      console.log('email sent')
      res.send(data);
    }
  });
});

module.exports.form = serverless(app);